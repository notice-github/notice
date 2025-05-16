import { BlockModel, FileModel, WorkspaceModel } from '@notice-app/models'
import { FileSchema } from '@notice-app/api/schemas'
import { useMutation, useQuery } from '@tanstack/react-query'

import { API, queryClient } from '../../utils/query'
import { invalidatePublishState } from '../bms/usePublishState'

export const useFiles = (
	workspace: WorkspaceModel.client,
	options?: Omit<FileSchema.getAll['queryIn'], 'workspaceId'>
) => {
	const query = useQuery<FileSchema.getAll['response']['200']['data']>(
		['files', workspace.id, options?.type],
		async () => {
			const { data } = await API.get(`/files?workspaceId=${workspace.id}`, { params: options })
			return data.data
		}
	)

	return query
}

export const useFile = (url: string) => {
	const query = useQuery<FileSchema.getOne['response']['200']['data']>(['file', url], async () => {
		const { data } = await API.get(`/files/${encodeURIComponent(url)}`)
		return data.data
	})

	return query
}

export const useUpdateFile = (url: string, page: BlockModel.block) => {
	const mutation = useMutation<
		FileSchema.updateOne['response']['200']['data'],
		unknown,
		FileSchema.updateOne['bodyIn']
	>(
		async (body) => {
			const { data } = await API.patch(`/files/${encodeURIComponent(url)}`, body)

			queryClient.setQueryData<FileModel.client>(['file', url], (file) => {
				return file
			})

			return data.data
		},
		{
			onSuccess: (data, vars) => {
				queryClient.invalidateQueries({
					predicate: (query) => {
						// Check if the first element of the query key array is 'files'
						return query.queryKey[0] === 'files'
					},
				})
				queryClient.setQueryData<FileModel.client>(['file', url], (file) => {
					if (file == undefined) return undefined

					return {
						...file,
						...vars,
					}
				})

				queryClient.invalidateQueries(['slate-value', page.id])
				// TODO: for some reason it does not work
				invalidatePublishState(page.rootId)
			},
		}
	)

	return mutation
}
