import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { SubscriptionSchema } from '@notice-app/api/schemas'

import { API } from '../../../utils/query'

export const useSubscribe = () => {
	const mutation = useMutation<
		SubscriptionSchema.subscribe['response']['200']['data'],
		unknown,
		{ workspace: WorkspaceModel.client } & SubscriptionSchema.subscribe['bodyIn']
	>(async ({ workspace, ...body }) => {
		const { data } = await API.post(`/subscriptions/${workspace.id}/subscribe`, body)
		return data.data
	})

	return mutation
}
