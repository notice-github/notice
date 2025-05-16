import { BlockSchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useQuery } from '@tanstack/react-query'

import { BMS } from '../../../utils/query'

export const useProjects = (workspace: WorkspaceModel.client) => {
	const query = useQuery<BlockSchema.getMultiple['response']['200']['data']>(['projects', workspace.id], async () => {
		const { data } = await BMS.get(`/blocks?workspaceId=${workspace.id}&isRoot=true&type=page`)
		return data.data
	})

	return query
}
