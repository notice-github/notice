import { WorkspaceModel } from '@notice-app/models'
import { InvitationSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useRefuseInvitation = () => {
	const mutation = useMutation<void, unknown, InvitationSchema.acceptOrRefuse['bodyIn']>(async ({ token }) => {
		await API.post('/invitations/refuse', { token })
	})

	return mutation
}
