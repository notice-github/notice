import { BlockSchema } from '@notice-app/api/schemas'
import { PageModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { BMS, queryClient } from '../../../utils/query'
import { updateEditorValue } from '../editor/useEditorValue'
import { invalidatePublishState } from '../usePublishState'

export const useCreatePage = () => {
	const mutation = useMutation<
		BlockSchema.createOne['response']['201']['data'],
		unknown,
		{ parent: PageModel.node; name: string }
	>(
		async ({ parent, name }) => {
			const { data } = await BMS.post('/blocks', {
				block: { type: 'page', data: { text: name }, metadata: {} },
				isRoot: false,
				parentId: parent.id,
				neighborId: null,
			})

			return data.data
		},
		{
			onSuccess: async (data, { parent }) => {
				await queryClient.invalidateQueries(['pages-graph', parent.rootId])

				updateEditorValue(parent, (value) => {
					if (!value) return value
					return [...value, { id: data.id, type: data.type, children: [{ text: data.data.text }] }]
				})

				invalidatePublishState(parent.rootId)
			},
		}
	)

	return mutation
}
