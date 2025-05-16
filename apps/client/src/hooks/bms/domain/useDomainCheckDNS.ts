import { DomainSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BMS } from '../../../utils/query'

export const useDomainCheckDNS = () => {
	const mutation = useMutation<
		DomainSchema.checkDNS['response']['200']['data'],
		unknown,
		DomainSchema.checkDNS['bodyIn']
	>(async (body) => {
		const { data } = await BMS.post('/domain/check/dns', body)
		return data.data
	})

	return mutation
}
