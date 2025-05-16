import { UserSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API, queryClient } from '../../utils/query'

export const useUpdateUser = () => {
	const mutation = useMutation<UserSchema.update['response']['200']['data'], undefined, UserSchema.update['bodyIn']>(
		async (user) => {
			const { data } = await API.patch('/user', user)
			return data.data
		},
		{
			onSuccess: async (data, variables, context) => {
				queryClient.setQueryData(['user'], data)
			},
		}
	)

	return mutation
}
