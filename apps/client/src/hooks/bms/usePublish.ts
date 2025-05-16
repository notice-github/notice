import { BlockModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { BMS } from '../../utils/query'

export const usePublish = () => {
	const mutation = useMutation<void, unknown, { block: BlockModel.block }>(async ({ block }) => {
		await BMS.post(`/blocks/${block.id}/publish`)
	})

	return mutation
}
