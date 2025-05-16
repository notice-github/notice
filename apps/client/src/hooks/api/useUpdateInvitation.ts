import { WorkspaceModel } from '@notice-app/models'
import { InvitationSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useUpdateInvitation = () => {
	const mutation = useMutation<
		undefined,
		unknown,
		InvitationSchema.update['bodyIn'] & { invitation: WorkspaceModel.invitation; workspace: WorkspaceModel.client }
	>(async ({ invitation, workspace, ...body }) => {
		const { data } = await API.patch(`/invitations/${invitation.id}?workspaceId=${workspace.id}`, body)
		return data.data
	})

	return mutation
}
