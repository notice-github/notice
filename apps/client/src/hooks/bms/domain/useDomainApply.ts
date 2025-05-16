import { BlockModel } from '@notice-app/models'
import { DomainSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BMS } from '../../../utils/query'

export const useDomainApply = () => {
	const mutation = useMutation<
		DomainSchema.apply['response']['200']['data'],
		DomainSchema.apply['response']['409']['error'],
		DomainSchema.apply['bodyIn'] & { block: BlockModel.block }
	>(
		async ({ block, ...body }) => {
			const { data } = await BMS.post(`/domain/${block.id}/apply`, body)
			return data.data
		},
		{ retry: false }
	)

	return mutation
}
