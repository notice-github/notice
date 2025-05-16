import { BMSBlockModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { Handler } from 'typerestjs'
import { BlockSchema } from '../schemas/block.schema'
import { BlockService } from '../services/block.service'
import { CacheService } from '../services/cache.service'
import { MetadataService } from '../services/metadata.service'
import { PublishedBlockService } from '../services/published-block.service'
import { SearchService } from '../services/search.service'
import { SubscriptionService } from '../services/subscription.service'
import { WorkspaceService } from '../services/workspace.service'

export namespace BlockController {
	/**
	 * @POST /blocks
	 */
	export const createOne: Handler<BlockSchema.createOne> = async (req, reply) => {
		let block: BMSBlockModel.block

		if (req.body.isRoot) {
			const subscription = await SubscriptionService.getSubscription(req.body.workspaceId)

			block = await BlockService.insertBlock(
				{ ...req.body.block, workspaceId: req.body.workspaceId },
				{
					templateId: req.body.templateId,
					templateMode: req.body.templateMode,
					contactFormEmail: req.user?.email,
					hideBranding: subscription != undefined,
				},
				req.user
			)
		} else {
			if (!(await BlockService.exists(req.body.parentId))) return reply.error(404, 'parent_not_found')

			block = await BlockService.insertBlock(
				req.body.block,
				{
					templateId: req.body.templateId,
					parentId: req.body.parentId,
					neighborId: req.body.neighborId,
				},
				req.user
			)
		}

		return reply.success(201, BlockService.exportBlock(block))
	}

	/**
	 * @GET /blocks
	 */
	export const getMultiple: Handler<BlockSchema.getMultiple> = async (req, reply) => {
		const blocks = await BlockService.getMultiple({ ...req.query })

		if (req.query.isRoot && req.query.type === 'page') {
			WorkspaceService.isActive(req.query.workspaceId)
		}

		return reply.success(
			200,
			blocks.map((block) => BlockService.exportBlock(block))
		)
	}

	/**
	 * @GET /blocks/:blockId
	 */
	export const getOne: Handler<BlockSchema.getOne> = async (req, reply) => {
		return reply.success(200, BlockService.exportBlock(req.block))
	}

	/**
	 * @GET /blocks/:blockId/graph
	 */
	export const getGraph: Handler<BlockSchema.getGraph> = async (req, reply) => {
		const graph = await BlockService.getGraph(
			req.block._id,
			MongoDB.blocks,
			undefined,
			req.query.type != null ? { type: req.query.type } : undefined
		)
		if (graph == null) return reply.error(404, 'block_not_found')

		return reply.success(200, BlockService.exportGraph(graph))
	}

	/**
	 * @GET /blocks/:blockId/blocks
	 */
	export const getBlocks: Handler<BlockSchema.getBlocks> = async (req, reply) => {
		const blocks = await BlockService.getMultiple({ ids: req.block.blockIds, ...req.query })
		return reply.success(
			200,
			blocks.map((block) => BlockService.exportBlock(block))
		)
	}

	/**
	 * @PATCH /blocks/:blockId
	 */
	export const updateOne: Handler<BlockSchema.updateOne> = async (req, reply) => {
		if (req.body.preferences?.domain != null && req.body.preferences.domain.trim() !== '') {
			const exists = await MongoDB.blocks.findOne(
				{
					_id: { $ne: req.block._id },
					'preferences.domain': req.body.preferences.domain.trim(),
				},
				{ projection: { _id: 1 } }
			)

			if (exists) return reply.error(409, 'domain_already_used')
		}

		await BlockService.update(req.block._id, req.body)

		return reply.success(200)
	}

	/**
	 * @POST /blocks/:blockId/reorder
	 */
	export const reorder: Handler<BlockSchema.reorder> = async (req, reply) => {
		const res = await BlockService.reorder(req.block._id, req.body)

		if (res) return reply.success(200, { blockIds: res })

		return reply.error(404, 'block_not_found')
	}

	/**
	 * @POST /blocks/:blockId/duplicate
	 */
	export const duplicate: Handler<BlockSchema.duplicate> = async (req, reply) => {
		const graph = await BlockService.getGraph(req.block._id, MongoDB.blocks)
		if (graph == null) return reply.error(404, 'block_not_found')

		const block = await BlockService.duplicate(graph)

		if (!block.isRoot) {
			const parent = await BlockService.getParent(req.block._id)
			if (parent != null) await BlockService.addChildToBlock(parent, block._id)
		}

		if (block?.data?.displaySummary === true) {
			const texts = graph.blocks.filter((b) => ['header-1', 'header-2', 'header-3', 'paragraph'].includes(b.type))
			block.data = { ...block.data, summary: MetadataService.createSummary(texts) }
		}

		return reply.success(201, BlockService.exportBlock(block))
	}

	/**
	 * @POST /blocks/:blockId/publish
	 */
	export const publish: Handler<BlockSchema.publish> = async (req, reply) => {
		await CacheService.purgeCache(req.block.rootId)
		const blocks = await BlockService.getRawGraphToBlocks(req.block.rootId, MongoDB.blocks)
		if (!blocks) return reply.error(404, 'block_not_found')

		await PublishedBlockService.publish(req.block.rootId, blocks)

		return reply.success(200)
	}

	/**
	 * @POST /blocks/:blockId/unpublish
	 */
	export const unpublish: Handler<BlockSchema.unpublish> = async (req, reply) => {
		await CacheService.purgeCache(req.block.rootId)

		const blocks = await PublishedBlockService.unpublish(req.block._id)

		return reply.success(200)
	}

	/**
	 * @DELETE /blocks/:blockId
	 */
	export const deleteOne: Handler<BlockSchema.deleteOne> = async (req, reply) => {
		await BlockService.hardDeleteInGraph(req.block._id)

		if (req.block.isRoot) {
			CacheService.purgeCache(req.block._id).then(() => PublishedBlockService.unpublish(req.block._id))
		}

		return reply.success(200)
	}
}
