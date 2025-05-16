import { WorkspaceSchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { API, queryClient } from '../../utils/query'

export const useUpdateWorkspace = () => {
	const mutation = useMutation<
		WorkspaceSchema.update['response']['200']['data'],
		unknown,
		WorkspaceSchema.update['bodyIn'] & { workspace: WorkspaceModel.client }
	>(
		async ({ workspace, ...body }) => {
			const { data } = await API.patch(`/workspaces/${workspace.id}`, body)
			return data.data
		},
		{
			onMutate: async (vars) => {
				queryClient.setQueryData<WorkspaceModel.client[]>(
					['workspaces_all'],
					(workspaces) =>
						workspaces?.map((workspace) => (workspace.id === vars.workspace.id ? { ...workspace, ...vars } : workspace))
				)
			},
			onSuccess: async (_, vars) => {
				await queryClient.invalidateQueries(['workspace_infos', vars.workspace.id])
			},
		}
	)

	return mutation
}
