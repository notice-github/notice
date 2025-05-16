import { useQuery } from '@tanstack/react-query'
import { WorkspaceSchema } from '@notice-app/api/schemas'

import { API } from '../../utils/query'

export const useQueryWorkspaces = () => {
	const query = useQuery<WorkspaceSchema.getAll['response']['200']['data']>(['workspaces_all'], async () => {
		const { data } = await API.get('/workspaces')
		return data.data
	})

	return query
}

export const useWorkspaces = () => useQueryWorkspaces().data ?? []
