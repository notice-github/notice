import { NIterators } from '@notice-app/utils'
import { useQuery } from '@tanstack/react-query'
import { BlockModel, PageModel } from '@notice-app/models'

import { BMS, queryClient } from '../../../utils/query'
import { useCurrentProject } from '../project/useCurrentProject'

export const usePagesGraph = (rootId?: string | null) => {
	const query = useQuery<PageModel.graph | null>(['pages-graph', rootId], async () => {
		if (rootId == null) return null

		const { data } = await BMS.get(`/blocks/${rootId}/graph?type=page`)
		const block: BlockModel.graph = data.data

		queryClient.setQueryData(['pages-blocks', rootId], mapBlocks(block.blocks))

		return blockToPage(block)
	})

	return query
}

export const usePagesBlocks = (rootId?: string | null): Map<string, BlockModel.block> => {
	const query = useQuery(['pages-blocks', rootId], () => new Map())
	return query.data ?? new Map()
}

export const usePageBlock = (page: PageModel.node) => {
	const [project] = useCurrentProject()
	const pages = usePagesBlocks(page.rootId)
	return project?.id === page.id ? project : pages.get(page.id)
}

export const parentOf = (page: PageModel.node) => {
	const graph = queryClient.getQueryData<PageModel.graph>(['pages-graph', page.rootId])
	if (!graph) return undefined

	let parent: PageModel.graph | undefined

	NIterators.walkGraph(
		graph,
		(node, _parent) => {
			if (node.id === page.id) parent = _parent ?? node
		},
		'subpages'
	)

	return parent
}

const mapBlocks = (blocks: BlockModel.graph[]): Map<string, BlockModel.block> => {
	const map = new Map<string, BlockModel.block>()

	for (let block of blocks) {
		NIterators.walkGraph(block, (node) => {
			const { blocks, ...data } = node
			map.set(data.id, { ...data, blockIds: blocks.map((b) => b.id) })
		})
	}

	return map
}

const blockToPage = (block: BlockModel.graph): PageModel.graph => {
	return {
		id: block.id,
		rootId: block.rootId,
		subpages: block.blocks.map((block) => blockToPage(block)),
	}
}
