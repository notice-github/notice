import { Route } from 'typerestjs'
import { PublishedBlockController } from '../controllers/published-block.controller'
import { PublishedBlockSchema } from '../schemas/published-block.schema'

export namespace PublisedBlockRoute {
	export const PREFIX = '/published-blocks'

	export const get: Route<PublishedBlockSchema.get> = {
		method: 'GET',
		path: '/:blockIdOrDomain',
		schema: PublishedBlockSchema.get,
		handler: PublishedBlockController.get,
	}

	export const getState: Route<PublishedBlockSchema.getState> = {
		method: 'GET',
		path: '/:blockId/state',
		//
		// While removing the authentication middleware may not pose a significant security risk
		// since it does not expose any private block data, it can improve request performance
		// by eliminating the need for checking Postgres permissions.
		//
		// middlewares: [AuthMiddleware.fromBlock({ role: 'viewer' })],
		schema: PublishedBlockSchema.getState,
		handler: PublishedBlockController.getState,
	}

	export const getPage: Route<PublishedBlockSchema.getPage> = {
		method: 'GET',
		path: '/:blockIdOrDomain/page',
		schema: PublishedBlockSchema.getPage,
		handler: PublishedBlockController.getPage,
	}
}
