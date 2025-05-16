import { Route } from 'typerestjs'
import { FileController } from '../controllers/file.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { FileSchema } from '../schemas/file.schema'

export namespace FileRoute {
	export const PREFIX = '/files'

	export const addOne: Route<FileSchema.addOne> = {
		method: 'POST',
		path: '/',
		middlewares: [GuardMiddleware.workspace({ role: 'editor', source: 'body' })],
		schema: FileSchema.addOne,
		handler: FileController.addOne,
	}

	export const getAll: Route<FileSchema.getAll> = {
		method: 'GET',
		path: '/',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'query' })],
		schema: FileSchema.getAll,
		handler: FileController.getAll,
	}

	export const getOne: Route<FileSchema.getOne> = {
		method: 'GET',
		path: '/:url',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'params' })],
		schema: FileSchema.getOne,
		handler: FileController.getOne,
	}

	export const updateOne: Route<FileSchema.updateOne> = {
		method: 'PATCH',
		path: '/:url',
		middlewares: [GuardMiddleware.workspace({ role: 'editor', source: 'params' })],
		schema: FileSchema.updateOne,
		handler: FileController.updateOne,
	}

	export const storage: Route<FileSchema.storage> = {
		method: 'GET',
		path: '/storage',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'query' })],
		schema: FileSchema.storage,
		handler: FileController.storage,
	}
}
