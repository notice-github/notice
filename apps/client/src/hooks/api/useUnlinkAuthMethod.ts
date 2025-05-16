import { AuthSchema, UserSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API, queryClient } from '../../utils/query'

export const useUnlinkAuthMethod = () => {
	const mutation = useMutation<void, unknown, { provider: AuthSchema.unlink['params']['provider'] }>(
		async ({ provider }) => {
			await API.post(`/auth/${provider}/unlink`)
		},
		{
			onSuccess: (_, { provider }) => {
				queryClient.setQueryData<UserSchema.get['response']['200']['data']>(['user'], (user) => {
					if (!user) return user
					return { ...user, [`${provider}Id`]: null }
				})
			},
		}
	)

	return mutation
}
