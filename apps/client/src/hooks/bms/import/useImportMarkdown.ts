import { BlockModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { BMS, queryClient } from '../../../utils/query'

export const useImportMarkdown = () => {
	const mutation = useMutation<undefined, unknown, { page: BlockModel.block; markdown: string }>(
		async ({ page, markdown }) => {
			await BMS.post('/import/markdown', {
				pageId: page.id,
				markdown,
			})
		},
		{
			onSuccess: async (_, vars) => {
				await queryClient.invalidateQueries(['slate-value', vars.page.id])
			},
		}
	)

	return mutation
}
