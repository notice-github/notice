import { useMemo } from 'react'
import { PageModel } from '@notice-app/models'

import { usePagesGraph } from './usePages'
import { useSearchParam } from '../../useSearchParam'
import { useCurrentProject } from '../project/useCurrentProject'

export const useActivePages = () => {
	const [project] = useCurrentProject()
	const pagesGraph = usePagesGraph(project?.id)
	const [pageId] = useSearchParam('page')

	const activePages = useMemo(() => {
		if (project == null) return []
		else if (pagesGraph.data == null) return [{ id: project.id, rootId: project.rootId }]
		else return findActivePages(pagesGraph.data, pageId ?? project.id) ?? [{ id: project.id, rootId: project.rootId }]
	}, [project, pagesGraph.data, pageId])

	return activePages
}

const findActivePages = (
	graph: PageModel.graph,
	id: string,
	path: PageModel.node[] = []
): PageModel.node[] | undefined => {
	if (graph.id === id) return [...path, { id: graph.id, rootId: graph.rootId }]

	for (let node of graph.subpages) {
		const newPath = findActivePages(node, id, [...path, { id: graph.id, rootId: graph.rootId }])
		if (newPath != undefined) return newPath
	}
}
