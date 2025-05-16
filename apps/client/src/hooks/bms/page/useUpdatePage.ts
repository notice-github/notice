import mergeWith from 'lodash.mergewith'
import { BlockSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { BlockModel, PageModel } from '@notice-app/models'

import { parentOf } from './usePages'
import { BMS, queryClient } from '../../../utils/query'
import { invalidatePublishState } from '../usePublishState'
import { updateEditorValue } from '../editor/useEditorValue'

export const useUpdatePage = () => {
	const mutation = useMutation<void, unknown, BlockSchema.updateOne['bodyIn'] & { page: PageModel.node }>(
		async ({ page, ...body }) => {
			await BMS.patch(`/blocks/${page.id}`, body)
		},
		{
			onMutate: ({ page, ...body }) => {
				queryClient.setQueryData<Map<string, BlockModel.block>>(['pages-blocks', page.rootId], (blocks) => {
					if (!blocks) return blocks

					const block = blocks.get(page.id)
					if (!block) return blocks

					return new Map(
						Array.from(blocks.entries()).map(([id, _block]) => {
							if (id === page.id)
								return [
									id,
									mergeWith(structuredClone(_block), structuredClone(body), (value, source) => {
										if (typeof value === 'object' && Array.isArray(value)) {
											return source
										}
									}),
								]
							else return [id, _block]
						})
					)
				})

				const parent = parentOf(page)
				if (parent && body.data?.text != null) {
					updateEditorValue(parent, (value) => {
						if (!value) return value
						return value.map((elem) => {
							if (elem.id === page.id) return { ...elem, children: [{ text: body.data!.text }] }
							else return elem
						})
					})
				}
			},
			onSuccess: (_, { page }) => {
				invalidatePublishState(page.rootId)
			},
		}
	)

	return mutation
}
