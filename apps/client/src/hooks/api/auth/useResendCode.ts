import { AuthSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { API } from '../../../utils/query'

export const useResendCode = () => {
	const mutation = useMutation<void, unknown, AuthSchema.resend['bodyIn']>(async (body) => {
		await API.post('/auth/email/resend', body)
	})

	return mutation
}
