import { WorkspaceModel } from '@notice-app/models'
import { BillingSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useBillingDetails = () => {
	const mutation = useMutation<
		BillingSchema.details['response']['200']['data'],
		unknown,
		{ workspace: WorkspaceModel.client }
	>(async ({ workspace }) => {
		const { data } = await API.get(`/billing/${workspace.id}/details`)
		return data.data
	})

	return mutation
}
