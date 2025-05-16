import { PageModel } from '@notice-app/models'
import { BlockSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { BMS, queryClient } from '../../../utils/query'
import { updateEditorValue } from '../editor/useEditorValue'
import { invalidatePublishState } from '../usePublishState'
import { parentOf } from './usePages'

export const useDuplicatePage = () => {
	const mutation = useMutation<BlockSchema.duplicate['response']['201']['data'], unknown, { page: PageModel.node }>(
		async ({ page }) => {
			const { data } = await BMS.post(`/blocks/${page.id}/duplicate`)
			return data.data
		},
		{
			onSuccess: async (data, { page }) => {
				await queryClient.invalidateQueries(['pages-graph', page.rootId])

				const parent = parentOf(page)
				if (parent) {
					updateEditorValue(parent, (value) => {
						if (!value) return value
						const { text, ...others } = data.data

						return [...value, { id: data.id, type: data.type, children: [{ text: data.data.text }], ...others }]
					})
				}

				invalidatePublishState(page.rootId)
			},
		}
	)

	return mutation
}
