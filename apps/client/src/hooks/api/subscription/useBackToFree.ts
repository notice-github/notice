import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { API, queryClient } from '../../../utils/query'

export const useBackToFree = () => {
	const mutation = useMutation<void, unknown, { workspace: WorkspaceModel.client }>(
		async ({ workspace }) => {
			await API.post(`/subscriptions/${workspace.id}/app-sumo-back-to-free`)
			return
		},
		{
			onSuccess: async (_, vars) => {
				await queryClient.invalidateQueries(['workspaces_all'])
				await queryClient.invalidateQueries(['subscription', vars.workspace.id])
			},
		}
	)

	return mutation
}
