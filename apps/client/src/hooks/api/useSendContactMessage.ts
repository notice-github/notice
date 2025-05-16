import { useMutation } from '@tanstack/react-query'

import { Lighthouse } from '../../utils/query'

export const useSendContactMessage = () => {
	const mutation = useMutation<any, unknown, {
		contactData: Record<string, string | boolean>
	}>(async ({ contactData }) => {
		const { data } = await Lighthouse.post('/contact', { ...contactData })
		return data.data
	})

	return mutation
}
