import { V1ProjectController } from '@root/controllers/v1/project.controller'
import { APIMiddleware } from '@root/middlewares/api.middleware'
import { V1ProjectSchema } from '@root/schemas/v1/project.schema'
import { Route } from 'typerestjs'

export namespace V1ProjectRoute {
	export const PREFIX = '/v1/projects'

	/**
	 * @GET /v1/projects/:projectId
	 */
	export const get: Route<V1ProjectSchema.get> = {
		method: 'GET',
		path: '/:projectId',
		middlewares: [APIMiddleware.autolang()],
		schema: V1ProjectSchema.get,
		handler: V1ProjectController.get,
	}

	/**
	 * @GET /v1/projects/:projectId/pages
	 */
	export const pages: Route<V1ProjectSchema.pages> = {
		method: 'GET',
		path: '/:projectId/pages',
		middlewares: [APIMiddleware.autolang()],
		schema: V1ProjectSchema.pages,
		handler: V1ProjectController.pages,
	}

	/**
	 * @GET /v1/projects/:projectId/blocks-tree
	 */
	export const blocksTree: Route<V1ProjectSchema.blocksTree> = {
		method: 'GET',
		path: '/:projectId/blocks-tree',
		middlewares: [APIMiddleware.autolang()],
		schema: V1ProjectSchema.blocksTree,
		handler: V1ProjectController.blocksTree,
	}

	/**
	 * @GET /v1/projects/:projectId/pages-tree
	 */
	export const pagesTree: Route<V1ProjectSchema.pagesTree> = {
		method: 'GET',
		path: '/:projectId/pages-tree',
		middlewares: [APIMiddleware.autolang()],
		schema: V1ProjectSchema.pagesTree,
		handler: V1ProjectController.pagesTree,
	}
}
