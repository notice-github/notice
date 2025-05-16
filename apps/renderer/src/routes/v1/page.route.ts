import { V1PageController } from '@root/controllers/v1/page.controller'
import { APIMiddleware } from '@root/middlewares/api.middleware'
import { V1PageSchema } from '@root/schemas/v1/page.schema'
import { Route } from 'typerestjs'

export namespace V1PageRoute {
	export const PREFIX = '/v1/pages'

	/**
	 * @GET /v1/pages/:pageId
	 */
	export const get: Route<V1PageSchema.get> = {
		method: 'GET',
		path: '/:pageId',
		middlewares: [APIMiddleware.autolang()],
		schema: V1PageSchema.get,
		handler: V1PageController.get,
	}

	/**
	 * @GET /v1/pages/:pageId/settings
	 */
	export const settings: Route<V1PageSchema.settings> = {
		method: 'GET',
		path: '/:pageId/settings',
		middlewares: [APIMiddleware.autolang()],
		schema: V1PageSchema.settings,
		handler: V1PageController.settings,
	}

	/**
	 * @GET /v1/pages/:pageId/blocks
	 */
	export const blocks: Route<V1PageSchema.blocks> = {
		method: 'GET',
		path: '/:pageId/blocks',
		middlewares: [APIMiddleware.autolang()],
		schema: V1PageSchema.blocks,
		handler: V1PageController.blocks,
	}

	/**
	 * @GET /v1/pages/:pageId/seo
	 */
	export const seo: Route<V1PageSchema.seo> = {
		method: 'GET',
		path: '/:pageId/seo',
		middlewares: [APIMiddleware.autolang()],
		schema: V1PageSchema.seo,
		handler: V1PageController.seo,
	}
}
