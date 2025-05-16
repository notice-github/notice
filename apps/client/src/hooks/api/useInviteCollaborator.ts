import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { InvitationSchema } from '@notice-app/api/schemas'

import { API, queryClient } from '../../utils/query'

export const useCreateInvitation = () => {
	const mutation = useMutation<
		undefined,
		unknown,
		InvitationSchema.create['bodyIn'] & { workspace: WorkspaceModel.client }
	>(
		async ({ email, role, workspace }) => {
			const { data } = await API.post(`/invitations?workspaceId=${workspace.id}`, { email, role })
			return data.data
		},
		{
			onSuccess: async (data, variables) => {
				await queryClient.invalidateQueries(['invitations_all', variables.workspace.id])
			},
		}
	)

	return mutation
}
