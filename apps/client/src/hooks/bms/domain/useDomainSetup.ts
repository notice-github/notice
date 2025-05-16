import { BlockModel } from '@notice-app/models'
import { DomainSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BMS } from '../../../utils/query'

export const useDomainSetup = () => {
	const mutation = useMutation<
		DomainSchema.setup['response']['200']['data'],
		DomainSchema.setup['response']['409']['error'],
		DomainSchema.setup['bodyIn'] & { block: BlockModel.block }
	>(
		async ({ block, ...body }) => {
			const { data } = await BMS.post(`/domain/${block.id}/setup`, body)
			return data.data
		},
		{ retry: false }
	)

	return mutation
}
