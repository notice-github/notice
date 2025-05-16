import { BlockSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BlockModel, WorkspaceModel } from '@notice-app/models'

import { BMS, queryClient } from '../../../utils/query'

export const useDuplicateProject = () => {
	const mutation = useMutation<
		BlockSchema.duplicate['response']['201']['data'],
		unknown,
		{ project: BlockModel.block; workspace: WorkspaceModel.client }
	>(
		async ({ project }) => {
			const { data } = await BMS.post(`/blocks/${project.id}/duplicate`)
			return data.data
		},
		{
			onSuccess: (data, vars) => {
				queryClient.setQueryData<BlockModel.block[]>(['projects', vars.workspace.id], (projects) =>
					projects ? [...projects, data] : undefined
				)
			},
		}
	)

	return mutation
}
