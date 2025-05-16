import { BlockSchema } from '@notice-app/api/schemas'
import { BlockModel, WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { BMS, queryClient } from '../../../utils/query'

export const useCreateProject = () => {
	const mutation = useMutation<
		BlockSchema.createOne['response']['201']['data'],
		unknown,
		{
			workspace: WorkspaceModel.client
			name?: string
			templateId?: string
			mixpanelType?: string
			templateMode?: string
			preferences?: Record<string, any>
		}
	>(
		async ({ workspace, name, templateId, templateMode, mixpanelType, preferences }) => {
			const { data } = await BMS.post('/blocks', {
				block: { type: 'page', data: { text: name }, metadata: {}, preferences: preferences },
				templateId: templateId ?? null,
				isRoot: true,
				templateMode: templateMode,
				workspaceId: workspace.id,
				mixpanelType: mixpanelType,
			})
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
