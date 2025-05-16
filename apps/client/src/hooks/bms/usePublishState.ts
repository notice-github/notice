import { PublishedBlockSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { NSystem } from '@notice-app/utils'
import { BMS, queryClient } from '../../utils/query'
import { useCurrentProject } from './project/useCurrentProject'

export const usePublishState = () => {
	const [project] = useCurrentProject()

	const query = useQuery<PublishedBlockSchema.getState['response']['200']['data']>(
		['publish-state', project?.id],
		async () => {
			if (project?.id == null) return 'not_published'

			const { data } = await BMS.get(`/published-blocks/${project.id}/state`)
			return data.data
		}
	)

	return query
}

export const invalidatePublishState = async (projectId: string) => {
	await NSystem.sleep(500)
	await queryClient.invalidateQueries(['publish-state', projectId])
}
