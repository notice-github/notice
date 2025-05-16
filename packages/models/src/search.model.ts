import { Is, ModelType } from 'typerestjs'
import { BlockModel } from './block.model'

export namespace SearchModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The block model that is use by the index
	 */
	export const block = Is.object({
		// Primary key
		id: Is.string().uuid(), // blockId_[$lang|default]

		// Distinct
		blockId: Is.string().uuid(),

		// Searchable
		content: Is.string(),

		// Filterable
		langs: Is.array(Is.string()),
		type: BlockModel.types,
		rootId: Is.string().uuid(),
		workspaceId: Is.string().uuid(),

		// Computed
		pageId: Is.string().uuid(), // filterable
		contextId: Is.string().uuid(),

		// Raw
		data: BlockModel.data,
	})
	export type block = ModelType<typeof block>

	/**
	 * The model that is use for the search result
	 */
	export const hit = block
		.pick({
			type: true,
			data: true,
			rootId: true,
			pageId: true,
			blockId: true,
		})
		.extend({
			context: BlockModel.block.pick({ id: true, type: true, data: true }).optional(),
			highlights: Is.array(Is.object({ start: Is.number(), length: Is.number() })),
		})
	export type hit = ModelType<typeof hit>
}
