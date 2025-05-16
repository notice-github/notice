import { DomainSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BMS } from '../../../utils/query'

export const useDomainCheckAvailability = () => {
	const mutation = useMutation<
		DomainSchema.checkAvailability['response']['200']['data'],
		unknown,
		DomainSchema.checkAvailability['bodyIn']
	>(async (body) => {
		const { data } = await BMS.post('/domain/check/availability', body)
		return data.data
	})

	return mutation
}
