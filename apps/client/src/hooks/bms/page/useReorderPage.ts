import { BlockSchema } from '@notice-app/api/schemas'
import { BlockModel, PageModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { NIterators } from '@notice-app/utils'
import { BMS, queryClient } from '../../../utils/query'
import { updateEditorValue } from '../editor/useEditorValue'
import { invalidatePublishState } from '../usePublishState'

export const useReorderPage = () => {
	const mutation = useMutation<
		void,
		unknown,
		Partial<BlockSchema.reorder['bodyIn']> & {
			page: PageModel.node
			newParent: PageModel.node
			oldParent: PageModel.node
		}
	>(
		async ({ page, newParent, oldParent, newNeighborId }) => {
			if (page.id === newParent.id || newNeighborId === page.id) return
			const { data } = await BMS.post(`/blocks/${page.id}/reorder`, {
				page: page,
				newParentId: newParent.id,
				oldParentId: oldParent.id,
				newNeighborId,
			})
			return data.data
		},
		{
			onMutate: ({ page, newParent, oldParent, newNeighborId }) => {
				if (page.id === newParent.id || newNeighborId === page.id) return

				queryClient.setQueryData<BlockModel.block[]>(['pages-graph', page.rootId], (graph) => {
					let newGraph = structuredClone(graph)
					let movedNode: any = null

					// TODO: I am deeply sorry for the inneficiency of this code
					// You can do everything in one pass instead of three

					// Find the node that is being moved
					NIterators.walkGraph(
						newGraph,
						(node: any) => {
							if (!node?.id) return
							if (node.id === page.id) {
								movedNode = node
							}
						},
						'subpages'
					)

					// Remove the node from the old parent
					NIterators.walkGraph(
						newGraph,
						(node: any) => {
							if (!node?.id) return

							if (node.id === oldParent.id) {
								if (!node.subpages) node.subpages = []

								node.subpages = node.subpages.filter((node: any) => node.id !== page.id)
							}
						},
						'subpages'
					)

					// Add the node in the new parent
					NIterators.walkGraph(
						newGraph,
						(node: any) => {
							if (!node?.id) return

							if (node.id === newParent.id) {
								if (!node.subpages) node.subpages = []

								const neighborIndex = node.subpages.findIndex((n: any) => n.id === newNeighborId) + 1

								node.subpages.splice(neighborIndex, 0, movedNode)
							}
						},
						'subpages'
					)

					return newGraph
				})
			},
			onSuccess: async (data, { page, newParent, oldParent, newNeighborId }) => {
				if (page.id === newParent.id || newNeighborId === page.id) return

				let slatePage: PageModel.node | null = null

				await queryClient.invalidateQueries(['pages-graph', page.rootId])

				// Update the editor value by removing the node from the old parent
				updateEditorValue(oldParent, (value) => {
					if (!value) return

					return value.filter((node) => {
						if (node.id === page.id) {
							slatePage = node
							return false
						}
						return true
					})
				})

				// Update the editor value by removing the node from the new parent
				updateEditorValue(newParent, (value) => {
					if (!value) return value
					const index = value.findIndex((node) => node.id === newNeighborId) + 1
					const clonedArray = structuredClone(value)
					clonedArray.splice(index, 0, slatePage)

					return clonedArray
				})

				invalidatePublishState(page.rootId)
			},
			onError: (err, { page, oldParent }) => {},
		}
	)

	return mutation
}
