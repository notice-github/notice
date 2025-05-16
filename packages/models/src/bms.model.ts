import { CustomType, Is, ModelType } from 'typerestjs'
import { BlockModel } from './block.model'

export namespace BMSBlockModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the collection
	 */
	export const block = BlockModel.block.omit({ id: true }).extend({
		_id: Is.string().uuid(),
		isRoot: Is.boolean().optional(),
		isTemplate: Is.boolean().optional(),
		workspaceId: Is.string().uuid(),
		createdAt: Is.date(),
		updatedAt: Is.date(),
		deletedAt: Is.date().optional(),
	})
	export type block = ModelType<typeof block>

	//-----------------//
	// All meta models //
	//-----------------//

	export const graph: CustomType<graph> = Is.lazy(() => {
		return block.extend({
			blocks: Is.array(graph),
		}) as CustomType<graph>
	})
	export type graph = block & { blocks: graph[] }
}
