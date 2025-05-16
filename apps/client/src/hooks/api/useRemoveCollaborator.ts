import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { CollaboratorSchema } from '@notice-app/api/schemas'

import { API, queryClient } from '../../utils/query'

export const useRemoveCollaborator = () => {
	const mutation = useMutation<
		CollaboratorSchema.remove['response']['200'],
		undefined,
		{ workspace: WorkspaceModel.client; collaborator: WorkspaceModel.collaborator }
	>(
		async ({ workspace, collaborator }) => {
			const { data } = await API.delete(`/collaborators/${collaborator.id}?workspaceId=${workspace.id}`)
			return data.data
		},
		{
			onSuccess: async (data, variables, context) => {
				await queryClient.invalidateQueries(['collaborators_all', variables.workspace.id])
			},
		}
	)

	return mutation
}
