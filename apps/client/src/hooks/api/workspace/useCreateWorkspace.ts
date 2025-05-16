import { WorkspaceSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { API, queryClient } from '../../../utils/query'

export const useCreateWorkspace = () => {
	const mutation = useMutation<
		WorkspaceSchema.createOne['response']['201']['data'],
		unknown,
		WorkspaceSchema.createOne['bodyIn']
	>(
		async (body) => {
			const { data } = await API.post('/workspaces', body)
			return data.data
		},
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(['workspaces_all'])
			},
		}
	)

	return mutation
}
