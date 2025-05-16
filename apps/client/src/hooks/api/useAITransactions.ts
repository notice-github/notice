import { AISchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useAITransactions = (workspaceId: string) => {
	const query = useQuery<AISchema.transactions['response']['200']['data']>(
		['ai_transactions', workspaceId],
		async () => {
			const { data } = await API.get(`/ai/transactions?workspaceId=${workspaceId}`)
			return data.data
		}
	)

	return query
}
