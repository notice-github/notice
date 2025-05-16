import { BlockModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { BMS, queryClient } from '../../../utils/query'

export const useImportBms = () => {
	const mutation = useMutation<undefined, unknown, { page: BlockModel.block; bms: any }>(
		async ({ page, bms }) => {
			await BMS.post('/import/bms', {
				pageId: page.id,
				bms,
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
