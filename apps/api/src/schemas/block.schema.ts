import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace BlockSchema {
	/**
	 * @POST /blocks
	 */
	export const createOne = {
		body: Is.union([
			Is.object({
				block: BlockModel.block.omit({ id: true, rootId: true, blockIds: true }),
				templateId: Is.string().uuid().optional(),
				templateMode: Is.enum(['partial', 'full']).default('full'),
				isRoot: Is.literal(true),
				mixpanelType: Is.string().optional(),

				workspaceId: Is.string().uuid(),
			}),
			Is.object({
				block: BlockModel.block.omit({ id: true, rootId: true, blockIds: true }),
				templateId: Is.string().uuid().optional(),
				templateMode: Is.enum(['partial', 'full']).default('full'),
				isRoot: Is.literal(false),
				mixpanelType: Is.string().optional(),

				parentId: Is.string().uuid(),
				neighborId: Is.string().uuid().nullable(),
			}),
		]),
		response: {
			201: Is.success(BlockModel.block),
			404: Is.error('parent_not_found'),
		},
	} satisfies Schema
	export type createOne = SchemaType<typeof createOne>

	/**
	 * @GET /blocks
	 */
	export const getMultiple = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
			type: BlockModel.types.optional(),
			isRoot: Is.boolean().optional(),
		}),
		response: {
			200: Is.success(Is.array(BlockModel.block)),
		},
	} satisfies Schema
	export type getMultiple = SchemaType<typeof getMultiple>

	/**
	 * @GET /blocks/:blockId
	 */
	export const getOne = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(BlockModel.block),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type getOne = SchemaType<typeof getOne>

	/**
	 * @GET /blocks/:blockId/graph
	 */
	export const getGraph = {
		params: Is.object({ blockId: Is.string().uuid() }),
		querystring: Is.object({
			type: BlockModel.types.optional(),
		}),
		response: {
			200: Is.success(BlockModel.graph),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type getGraph = SchemaType<typeof getGraph>

	/**
	 * @GET /blocks/:blockId/blocks
	 */
	export const getBlocks = {
		params: Is.object({ blockId: Is.string().uuid() }),
		querystring: Is.object({ type: BlockModel.types.optional() }),
		response: {
			200: Is.success(Is.array(BlockModel.block)),
		},
	} satisfies Schema
	export type getBlocks = SchemaType<typeof getBlocks>

	/**
	 * @PATCH /blocks/:blockId
	 */
	export const updateOne = {
		params: Is.object({ blockId: Is.string().uuid() }),
		body: BlockModel.block.omit({ id: true, rootId: true }).partial(),
		response: {
			200: Is.success(),
			404: Is.error('block_not_found'),
			409: Is.error('domain_already_used'),
		},
	} satisfies Schema
	export type updateOne = SchemaType<typeof updateOne>

	/**
	 * @POST /blocks/:blockId/reorder
	 */
	export const reorder = {
		params: Is.object({ blockId: Is.string().uuid() }),
		body: Is.object({
			oldParentId: Is.string().uuid(),
			newParentId: Is.string().uuid(),
			newNeighborId: Is.string().uuid().optional().nullable(),
		}),
		response: {
			200: Is.success(Is.object({ blockIds: Is.array(Is.string()) })),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type reorder = SchemaType<typeof reorder>

	/**
	 * @POST /blocks/:blockId/duplicate
	 */
	export const duplicate = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			201: Is.success(BlockModel.block),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type duplicate = SchemaType<typeof duplicate>

	/**
	 * @POST /blocks/:blockId/publish
	 */
	export const publish = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type publish = SchemaType<typeof publish>

	/**
	 * @POST /blocks/:blockId/unpublish
	 */
	export const unpublish = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(),
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type unpublish = SchemaType<typeof unpublish>

	/**
	 * @DELETE /blocks/:blockId
	 */
	export const deleteOne = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(),
		},
	} satisfies Schema
	export type deleteOne = SchemaType<typeof deleteOne>
}
