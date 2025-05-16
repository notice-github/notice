import { PageModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { parentOf } from './usePages'
import { BMS, queryClient } from '../../../utils/query'
import { invalidatePublishState } from '../usePublishState'
import { updateEditorValue } from '../editor/useEditorValue'

export const useDeletePage = () => {
	const mutation = useMutation<void, unknown, { page: PageModel.node }>(
		async ({ page }) => {
			await BMS.delete(`/blocks/${page.id}`)
		},
		{
			onSettled: async (_, __, { page }) => {
				const parent = parentOf(page)
				if (parent) {
					updateEditorValue(parent, (value) => {
						if (!value) return value
						return value.filter((elem) => elem.id !== page.id)
					})
				}

				await queryClient.invalidateQueries(['pages-graph', page.rootId])

				invalidatePublishState(page.rootId)
			},
		}
	)

	return mutation
}
