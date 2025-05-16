import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { API, queryClient } from '../../utils/query'

export const useRemoveInvitation = () => {
	const mutation = useMutation<
		undefined,
		unknown,
		{ invitation: WorkspaceModel.invitation; workspace: WorkspaceModel.client }
	>(
		async ({ invitation, workspace }) => {
			const { data } = await API.delete(`/invitations/${invitation.id}?workspaceId=${workspace.id}`)
			return data.data
		},
		{
			onSuccess: (data, variables) => {
				queryClient.setQueryData<WorkspaceModel.invitation[]>(
					['invitations_all', variables.workspace.id],
					(invitations) => invitations?.filter((inv) => inv.id !== variables.invitation.id)
				)
			},
		}
	)

	return mutation
}
