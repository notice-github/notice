import { AISchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'

export enum ImageStyle {
	Realistic = 'realistic',
	PixelArt = 'pixel-art',
	IsometricArt = 'isometric-art',
	Drawing = 'drawing',
	FlatIllustration = 'flat-illustration',
}

export const useAIGenerateImage = () => {
	const mutation = useMutation<
		AISchema.generateImage['response']['200']['data'],
		undefined,
		AISchema.generateImage['bodyIn'] & { workspace: WorkspaceModel.client; destroyElement?: () => void }
	>(
		async ({ workspace, destroyElement, ...body }) => {
			const { data } = await API.post(`/ai/generate/image?workspaceId=${workspace.id}`, body)
			return data.data
		},
		{
			onError: (_, { destroyElement }) => {
				destroyElement?.()
			},
		}
	)

	return mutation
}
