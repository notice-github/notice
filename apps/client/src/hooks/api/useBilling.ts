import { WorkspaceModel } from '@notice-app/models'
import { BillingSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useBilling = (workspace: WorkspaceModel.client) => {
	const query = useQuery<BillingSchema.get['response']['200']['data']>(['billing', workspace.id], async () => {
		const { data } = await API.get(`/billing/${workspace.id}`)
		return data.data
	})

	return query
}
