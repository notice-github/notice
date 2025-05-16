import { FileSchema } from '@notice-app/api/schemas'
import { useQuery } from '@tanstack/react-query'

import { API } from '../../utils/query'

export const useStorage = (workspaceId: string) => {
	const query = useQuery<FileSchema.storage['response']['200']['data']>(['workspaceId'], async () => {
		const { data } = await API.get(`/files/storage?workspaceId=${workspaceId}`)
		return data.data
	})

	return query
}
