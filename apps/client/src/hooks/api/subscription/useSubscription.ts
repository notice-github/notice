import { WorkspaceModel } from '@notice-app/models'
import { SubscriptionSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { API } from '../../../utils/query'

export const useSubscription = (workspace: WorkspaceModel.client) => {
	const query = useQuery<SubscriptionSchema.get['response']['200']['data']>(
		['subscription', workspace.id],
		async () => {
			try {
				const { data } = await API.get(`/subscriptions/${workspace.id}`)
				return data.data
			} catch (ex) {
				return null
			}
		}
	)

	return query
}
