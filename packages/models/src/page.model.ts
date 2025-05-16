import { CustomType, Is, ModelType } from 'typerestjs'
import { BlockModel } from './block.model'

export namespace PageModel {
	export const node = BlockModel.block.pick({ id: true, rootId: true })
	export type node = ModelType<typeof node>

	export const graph: CustomType<graph> = Is.lazy(() => {
		return node.extend({ subpages: Is.array(graph) }) as CustomType<graph>
	})
	export type graph = node & { subpages: graph[] }
}
