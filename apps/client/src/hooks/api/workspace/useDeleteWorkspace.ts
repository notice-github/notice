import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { API, queryClient } from '../../../utils/query'

export const useDeleteWorkspace = () => {
	const mutation = useMutation<void, unknown, { workspace: WorkspaceModel.client }>(
		async ({ workspace }) => {
			await API.delete(`/workspaces/${workspace.id}`)
		},
		{
			onSuccess: (_, { workspace }) => {
				queryClient.setQueriesData<WorkspaceModel.client[]>(['workspaces_all'], (workspaces) =>
					workspaces ? workspaces.filter((w) => w.id !== workspace.id) : undefined
				)
			},
		}
	)

	return mutation
}
