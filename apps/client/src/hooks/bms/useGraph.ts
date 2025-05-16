import { BlockSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { BMS } from '../../utils/query'

export const useGraph = (blockId: string) => {
	const query = useQuery<BlockSchema.getGraph['response']['200']['data']>(['blocks_graph', blockId], async () => {
		if (!blockId) return 'not a blockId'
		const { data } = await BMS.get(`blocks/${blockId}/graph?type=page`)
		return data.data
	})

	return query
}
