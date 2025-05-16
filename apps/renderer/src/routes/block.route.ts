import { BlockSchema } from '@root/schemas/block.schema'
import { BlockService } from '@root/services/block.service'
import { Route } from 'typerestjs'

export namespace BlockRoute {
	export const PREFIX = '/blocks'

	export const get: Route<BlockSchema.get> = {
		method: 'GET',
		path: '/:target',
		schema: BlockSchema.get,
		handler: async (req, reply) => {
			const block = await BlockService.getOne(req.params.target)
			if (!block) return reply.error(404, 'target_not_found')

			reply.custom().header('CDN-Tag', block.rootId)

			return reply.success(200, BlockService.exportBlock(block))
		},
	}

	export const pages: Route<BlockSchema.pages> = {
		method: 'GET',
		path: '/:blockId/pages',
		schema: BlockSchema.pages,
		handler: async (req, reply) => {
			const pages = await BlockService.getPagesOLD(req.params.blockId)

			reply.custom().header('CDN-Tag', req.params.blockId)

			return reply.success(
				200,
				pages.map((page) => BlockService.exportBlock(page))
			)
		},
	}
}
