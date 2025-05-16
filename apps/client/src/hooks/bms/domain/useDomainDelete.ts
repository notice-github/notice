import { BlockModel } from '@notice-app/models'
import { DomainSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BMS } from '../../../utils/query'

export const useDomainDelete = () => {
	const mutation = useMutation<DomainSchema.remove['response']['200']['data'], unknown, { block: BlockModel.block }>(
		async ({ block, ...body }) => {
			const { data } = await BMS.delete(`/domain/${block.id}`, body)
			return data.data
		}
	)

	return mutation
}
