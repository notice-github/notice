import { useQuery } from '@tanstack/react-query'
import { InvitationSchema } from '@notice-app/api/schemas'

import { API } from '../../utils/query'

export const useInvitations = (workspaceId: string) => {
	const query = useQuery<InvitationSchema.getAll['response']['200']['data']>(
		['invitations_all', workspaceId],
		async () => {
			const { data } = await API.get(`/invitations?workspaceId=${workspaceId}`)
			return data.data
		}
	)

	return query
}
