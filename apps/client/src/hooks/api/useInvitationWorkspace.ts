import { useQuery } from '@tanstack/react-query'
import { InvitationSchema } from '@notice-app/api/schemas'

import { API } from '../../utils/query'

export const useInvitationWorkspace = (token: string | null) => {
	const query = useQuery<InvitationSchema.getWorkspace['response']['200']['data']>(
		['invitations_workspace', token],
		async () => {
			if (token == null) throw new Error('token_not_found')
			const { data } = await API.get(`/invitations/workspace?token=${token}`)
			return data.data
		},
		{
			retry: false,
		}
	)

	return query
}
