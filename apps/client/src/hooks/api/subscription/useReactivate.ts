import { SubscriptionModel, WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import { SubscriptionSchema } from '@notice-app/api/schemas'

import { API, queryClient } from '../../../utils/query'

export const useReactivate = () => {
	const mutation = useMutation<
		SubscriptionSchema.reactivate['response']['200']['data'],
		unknown,
		{ workspace: WorkspaceModel.client }
	>(
		async ({ workspace }) => {
			const { data } = await API.post(`/subscriptions/${workspace.id}/reactivate`)
			return data.data
		},
		{
			onSuccess: (subscription, vars) => {
				queryClient.setQueryData<SubscriptionModel.subscription>(['subscription', vars.workspace.id], subscription)
			},
		}
	)

	return mutation
}
