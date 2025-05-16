import { UserSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { GTM } from '../../utils/GTM'
import { API } from '../../utils/query'

export const useQueryUser = () => {
	const query = useQuery<UserSchema.get['response']['200']['data']>(
		['user'],
		async () => {
			const { data } = await API.get('/user')
			return data.data
		},
		{
			retry: () => false,
			onSuccess(data) {
				GTM.send({ user_id: data.id })
			},
		}
	)

	return query
}

export const useUser = () => useQueryUser().data!
