import { BlockSchema } from '@notice-app/api/schemas'
import { BlockModel, WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'
import mergeWith from 'lodash.mergewith'

import { BMS, queryClient } from '../../../utils/query'
import { invalidatePublishState } from '../usePublishState'

export const useUpdateProject = () => {
	const mutation = useMutation<
		void,
		unknown,
		BlockSchema.updateOne['bodyIn'] & { project: BlockModel.block; workspace: WorkspaceModel.client }
	>(
		async ({ project, workspace, ...body }) => {
			await BMS.patch(`/blocks/${project.id}`, body)
		},
		{
			onMutate: (vars) => {
				const { project, workspace, ...data } = vars

				queryClient.setQueryData<BlockModel.block[]>(['projects', vars.workspace.id], (projects) => {
					if (projects == undefined) return undefined

					return projects.map((project) => {
						if (project.id === vars.project.id) {
							return mergeWith(structuredClone(project), structuredClone(data), (value, source) => {
								if (typeof value === 'object' && Array.isArray(value)) {
									return source
								}
							})
						} else return project
					})
				})
			},
			onError: (_, vars) => {
				queryClient.setQueryData<BlockModel.block[]>(['projects', vars.workspace.id], (projects) => {
					if (projects == undefined) return undefined
					return projects.map((project) => (project.id === vars.project.id ? structuredClone(vars.project) : project))
				})
			},
			onSuccess: (_, vars) => {
				invalidatePublishState(vars.project.id)
			},
		}
	)

	return mutation
}
