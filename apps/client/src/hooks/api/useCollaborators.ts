import { useQuery } from '@tanstack/react-query'
import { CollaboratorSchema } from '@notice-app/api/schemas'

import { API } from '../../utils/query'

export const useCollaborators = (workspaceId: string) => {
	const query = useQuery<CollaboratorSchema.getAll['response']['200']['data']>(
		['collaborators_all', workspaceId],
		async () => {
			const { data } = await API.get(`/collaborators?workspaceId=${workspaceId}`)
			return data.data
		}
	)

	return query
}
