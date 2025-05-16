import { FileSchema } from '@notice-app/api/schemas'
import { FileModel, WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { getImageDimensions, getVideoDimensions } from '../../utils/image'
import { API, queryClient } from '../../utils/query'

export const useUploadFile = () => {
	const mutation = useMutation<
		FileSchema.addOne['response']['201']['data'],
		unknown,
		{
			workspace: WorkspaceModel.client
			file: File
			type?: 'image' | 'video' | 'application' | 'audio'
			source?: FileModel.source
		}
	>(
		async ({ workspace, file, type, source }) => {
			const formData = new FormData()

			formData.append('file', file)
			formData.append('workspaceId', workspace.id)

			if (type === 'image') {
				try {
					const { width, height } = await getImageDimensions(file)
					formData.append('aspectRatio', (width / height).toString())
				} catch (ex) {}
			}

			if (type === 'video') {
				try {
					const { width, height } = await getVideoDimensions(file)
					formData.append('aspectRatio', (width / height).toString())
				} catch (ex) {}
			}

			if (source) formData.append('source', source)

			const { data } = await API.postForm('/files', formData)
			return data.data
		},
		{
			onSuccess: (data, vars) => {
				if (data.source !== 'editor') return
				queryClient.setQueryData<WorkspaceModel.client[]>(['files', vars.workspace.id, vars.type], (files) => {
					return files ? [data, ...files] : undefined
				})
			},
		}
	)

	return mutation
}
