import { WorkspaceSchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useQuery } from '@tanstack/react-query'
import { API } from '../../../utils/query'

export const useWorkspaceInfos = (workspace: WorkspaceModel.client) => {
	const query = useQuery<WorkspaceSchema.getWorkspaceInfos['response']['200']['data']>(
		['workspace_infos', workspace.id],
		async () => {
			try {
				const { data } = await API.get(`/workspaces/${workspace.id}/info`)
				return data.data
			} catch (ex) {
				return null
			}
		}
	)

	return query
}
