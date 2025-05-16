import { UserSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API, queryClient } from '../../utils/query'

export const useSendForm = () => {
	const mutation = useMutation<UserSchema.form['response']['200']['success'], undefined, UserSchema.form['bodyIn']>(
		async (form) => {
			const { data } = await API.post(`/user/form`, form)
			return data.data
		},
		{
			onSuccess: async () => {
				queryClient.setQueryData(['user'], { formIsFilled: true })
			},
		}
	)

	return mutation
}
