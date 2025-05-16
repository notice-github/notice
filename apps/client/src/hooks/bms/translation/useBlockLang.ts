import { BlockSchema, GetterSchema } from '@notice-app/api/schemas'
import { useMutation, useQuery } from '@tanstack/react-query'
import { BlockModel, PageModel, WorkspaceModel } from '@notice-app/models'

import { BMS, queryClient } from '../../../utils/query'
import { NLanguages } from '../../../utils/languages'
import { useSearchParams } from '../../useSearchParams'
import { useSlateValue } from '../editor/useEditorValue'
import { invalidatePublishState } from '../usePublishState'

export const useBlockLang = (page: PageModel.node) => {
	const [params] = useSearchParams()
	const langCode = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE
	const blockId = params.block as string
	const [editorValue] = useSlateValue(page, langCode)

	const query = useQuery<GetterSchema.slate['response']['200']['data']>(
		['slate-block-lang', page.id, langCode, blockId],
		async () => {
			// default to page parent id value (title)
			const children = editorValue.data.children.find((b: any) => b.id === blockId) ?? editorValue.data
			return children
		},
		{ enabled: !!page.id && !!langCode && editorValue.isFetched }
	)

	const mutation = useMutation<
		void,
		unknown,
		BlockSchema.updateOne['bodyIn'] & {
			block: BlockModel.block
			page: BlockModel.block
			isPage?: boolean
		}
	>(
		async ({ block, isPage, data, lang }) => {
			if (isPage) {
				await BMS.patch(`/translation/${block.id}/title?lang=${lang ?? langCode}`, data)
			} else {
				await BMS.patch(`/translation/${block.id}?lang=${lang ?? langCode}`, { data })
			}
		},
		{
			onMutate: async (vars) => {
				const { data, lang } = vars

				await queryClient.setQueryData<any[]>(['slate-value', page.id, lang ?? langCode], (val) => {
					if (!val) return val

					const children = val.children.map((b: BlockModel.block) => {
						if (data && b.id === data.id) {
							return data
						}
						return b
					})
					const pageValue = { ...val, children }

					return pageValue
				})

				queryClient.setQueryData<any[]>(['slate-block-lang', page.id, lang ?? langCode, blockId], (val) => {
					return { ...val, ...data }
				})
			},
			onError: (vars) => {
				queryClient.setQueryData<any[]>(['slate-page-value', page.id, langCode], (val) => {
					return val
				})
			},
			onSuccess: () => {
				// TODO: maybe we could optimize by invalidating only when we close the translation modal.
				// But I find it more hacky, also the translation page mounts/unmounts twice
				// so it's hard to do (see comment in <PortalLayouts />)
				// Unsure.
				invalidatePublishState(page.rootId)
			},
		}
	)

	return [query, mutation]
}
