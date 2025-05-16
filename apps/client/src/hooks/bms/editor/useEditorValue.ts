import { GetterSchema, SaverSchema } from '@notice-app/api/schemas'
import { PageModel } from '@notice-app/models'
import { Updater, useMutation, useQuery } from '@tanstack/react-query'
import { NLanguages } from '../../../utils/languages'

import { BMS, queryClient } from '../../../utils/query'
import { invalidatePublishState } from '../../bms/usePublishState'

const timeouts: { [key: string]: NodeJS.Timeout | null } = {}

export const getEditorTimeouts = () => timeouts
export const resetEditorTimeouts = () => {
	for (let key in timeouts) {
		clearTimeout(timeouts[key]!)
		delete timeouts[key]
	}
}

export const useSlateValue = (page: PageModel.node, langCode?: NLanguages.LANGUAGE_CODES_TYPE) => {
	const query = useQuery<GetterSchema.slate['response']['200']['data']>(
		['slate-value', page.id, langCode],
		async () => {
			const langParam = langCode ? `&lang=${langCode}` : ''

			const { data } = await BMS.get(`/getters/slate?blockId=${page.id}${langParam}`)
			return data.data
		}
	)
	return [query] as const
}

export const useEditorValue = (page: PageModel.node, langCode?: NLanguages.LANGUAGE_CODES_TYPE) => {
	const [slateValue] = useSlateValue(page, langCode)

	const query = useQuery<GetterSchema.slate['response']['200']['data']>(
		['slate-page-value', page.id, langCode],
		async () => {
			return slateValue.data.children
		},
		{ staleTime: Infinity, enabled: slateValue.isFetched }
	)

	const mutation = useMutation<
		void,
		unknown,
		{ page: PageModel.node; value: SaverSchema.slate['bodyIn']; langCode?: NLanguages.LANGUAGE_CODES_TYPE }
	>(
		['slate-page-value', page.id, langCode],
		async ({ page, value }) => {
			await BMS.post(`/savers/slate`, {
				id: page.id,
				type: 'page',
				children: value,
			})
		},
		{
			onSuccess: () => {
				invalidatePublishState(page.rootId)
			},
		}
	)

	const setValue = (value: any, force = false, langCode?: NLanguages.LANGUAGE_CODES_TYPE) => {
		// this is not ready to use with a langCode at all, useBlockLang for that
		// translation never updates the full page
		if ((force && timeouts[page.id] == null) || langCode) return

		queryClient.setQueryData(['slate-page-value', page.id, langCode], value, {
			updatedAt: query.dataUpdatedAt,
		})
		queryClient.setQueryData(['slate-page-state', page.id], 'modified')

		if (!mutation.isLoading) {
			if (timeouts[page.id] != null) clearTimeout(timeouts[page.id]!)

			timeouts[page.id] = setTimeout(
				async () => {
					queryClient.setQueryData(['slate-page-state', page.id], 'saving')
					try {
						await mutation.mutateAsync({ page, value })
						queryClient.setQueryData(['slate-page-state', page.id], 'saved')
					} catch (ex) {
						queryClient.setQueryData(['slate-page-state', page.id], 'error')
					}
					timeouts[page.id] = null
				},
				force ? 0 : 3000
			)
		}
	}

	return [query, setValue] as const
}

export const updateEditorValue = (
	page: PageModel.node,
	updater: Updater<any[] | undefined, any[] | undefined>,
	langCode?: NLanguages.LANGUAGE_CODES_TYPE
) => {
	const value = queryClient.setQueryData<any[]>(['slate-page-value', page.id, langCode], updater)

	if (!value) return

	queryClient.setQueryData(['slate-page-state', page.id], 'modified')

	if (timeouts[page.id] != null) clearTimeout(timeouts[page.id]!)

	timeouts[page.id] = setTimeout(async () => {
		queryClient.setQueryData(['slate-page-state', page.id], 'saving')
		try {
			await BMS.post(`/savers/slate`, {
				id: page.id,
				type: 'page',
				children: value,
			})
			invalidatePublishState(page.rootId)
			queryClient.setQueryData(['slate-page-state', page.id], 'saved')
		} catch (ex) {
			queryClient.setQueryData(['slate-page-state', page.id], 'error')
		}
		timeouts[page.id] = null
	}, 3000)
}
