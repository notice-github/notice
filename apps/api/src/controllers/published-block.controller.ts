import { Handler } from 'typerestjs'
import { PublishedBlockSchema } from '../schemas/published-block.schema'
import { BlockService } from '../services/block.service'
import { PublishedBlockService } from '../services/published-block.service'

export namespace PublishedBlockController {
	export const get: Handler<PublishedBlockSchema.get> = async (req, reply) => {
		const graph = await PublishedBlockService.getRecursive(req.params.blockIdOrDomain, req.query.lang)
		if (graph == null) return reply.error(404, 'block_not_found')

		reply.custom().removeHeader('Access-Control-Allow-Credentials')
		reply.custom().header('Access-Control-Allow-Origin', '*')
		reply.custom().header('CDN-Tag', graph.rootId)

		return reply.custom().status(200).send(BlockService.exportGraph(graph))
	}

	export const getState: Handler<PublishedBlockSchema.getState> = async (req, reply) => {
		const state = await PublishedBlockService.getState(req.params.blockId)
		if (state === 'block_not_found') return reply.error(404, 'block_not_found')

		return reply.success(200, state)
	}

	export const getPage: Handler<PublishedBlockSchema.getPage> = async (req, reply) => {
		const page = await PublishedBlockService.getPage(req.params.blockIdOrDomain, req.query.lang)
		if (page == null) return reply.error(404, 'block_not_found')

		reply.custom().removeHeader('Access-Control-Allow-Credentials')
		reply.custom().header('Access-Control-Allow-Origin', '*')
		reply.custom().header('CDN-Tag', page.rootId)

		return reply.custom().status(200).send(page)
	}
}
