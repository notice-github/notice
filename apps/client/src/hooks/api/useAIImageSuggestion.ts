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

export const useAIImageSuggestion = () => {
	const mutation = useMutation<
		AISchema.imageSuggestion['response']['200']['data'],
		undefined,
		AISchema.imageSuggestion['bodyIn'] & { workspace: WorkspaceModel.client }
	>(async ({ workspace, ...body }) => {
		const { data } = await API.post(`/ai/image/suggestion?workspaceId=${workspace.id}`, body)
		return data.data
	})

	return mutation
}
