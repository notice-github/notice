import { AISchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { API } from '../../utils/query'
import { toast } from 'react-toastify'

export enum RephraseTypes {
	Formal = 'formal',
	Expand = 'expand',
	Short = 'short',
	Fun = 'fun',
	Correct = 'correct',
}

export const useAIRephrase = () => {
	const mutation = useMutation<
		AISchema.rephrase['response']['200']['data'],
		undefined,
		AISchema.rephrase['bodyIn'] & { workspace: WorkspaceModel.client }
	>(async ({ workspace, ...body }) => {
		const { data } = await API.post(`/ai/rephrase?workspaceId=${workspace.id}`, body)
		return data.data
	})

	return mutation
}
