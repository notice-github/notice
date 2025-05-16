import { WorkspaceModel } from '@notice-app/models'
import { CollaboratorSchema, InvitationSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useUpdateCollaborator = () => {
	const mutation = useMutation<
		undefined,
		unknown,
		CollaboratorSchema.update['bodyIn'] & {
			workspace: WorkspaceModel.client
			collaborator: WorkspaceModel.collaborator
		}
	>(async ({ collaborator, workspace, ...body }) => {
		const { data } = await API.patch(`/collaborators/${collaborator.id}?workspaceId=${workspace.id}`, body)
		return data.data
	})

	return mutation
}
