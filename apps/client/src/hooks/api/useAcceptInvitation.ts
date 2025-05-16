import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { InvitationSchema } from '@notice-app/api/schemas'
import { API, queryClient } from '../../utils/query'
import { useCurrentWorkspace } from './useCurrentWorkspace'

export const useAcceptInvitation = () => {
	const [_, setCurrentWorkspace] = useCurrentWorkspace()

	const mutation = useMutation<
		Exclude<InvitationSchema.acceptOrRefuse['response']['200']['data'], undefined>,
		unknown,
		InvitationSchema.acceptOrRefuse['bodyIn']
	>(
		async ({ token }) => {
			const { data } = await API.post('/invitations/accept', { token: token })
			return data.data
		},
		{
			onSuccess: (data, vars) => {
				queryClient.setQueryData<WorkspaceModel.client[]>(['workspaces_all'], (workspaces) =>
					workspaces ? [...workspaces, data] : undefined
				)

				setCurrentWorkspace(data)
			},
		}
	)

	return mutation
}
