import { useMutation } from '@tanstack/react-query'
import { BlockModel, WorkspaceModel } from '@notice-app/models'

import { BMS, queryClient } from '../../../utils/query'

export const useDeleteProject = () => {
	const mutation = useMutation<void, unknown, { project: BlockModel.block; workspace: WorkspaceModel.client }>(
		async ({ project }) => {
			await BMS.delete(`/blocks/${project.id}`)
		},
		{
			onSuccess: (_, vars) => {
				queryClient.setQueryData<BlockModel.block[]>(['projects', vars.workspace.id], (projects) =>
					projects ? projects.filter((project) => project.id !== vars.project.id) : undefined
				)
			},
		}
	)

	return mutation
}
