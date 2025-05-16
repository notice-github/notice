export namespace NIterators {
	/**
	 * Walks through a graph and performs a callback on each node.
	 *
	 * @param graph - The graph to be traversed.
	 * @param cb - The callback function to be executed on each node.
	 * @param blocks - The name of the field containing child nodes in the graph. (default: blocks)
	 */
	export const walkGraph = <T>(graph: T, cb: (node: T, parent?: T) => void, field = 'blocks', parent?: T): void => {
		cb(graph, parent)
		for (const block of (graph as any)[field] ?? []) {
			walkGraph(block, cb, field, graph)
		}
	}

	/**
	 * Maps through a graph and applies a mapper function on each node.
	 *
	 * @param graph - The graph to be mapped through.
	 * @param mapper - The mapper function to be applied on each node.
	 * @returns The new graph after mapping.
	 */
	export const mapGraph = <T extends { blocks: T[] }, MT extends { blocks: MT[] }>(
		graph: T,
		mapper: (node: Omit<T, 'blocks'>) => Omit<MT, 'blocks'>
	): MT => {
		const { blocks, ...data } = graph

		return {
			...mapper(data),
			blocks: blocks.map((block) => mapGraph<T, MT>(block, mapper)),
		} as MT
	}
}
