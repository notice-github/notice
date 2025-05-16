import { Route } from 'typerestjs'
import { ImportController } from '../controllers/import.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { ImportSchema } from '../schemas/import.schema'

export namespace ImportRoute {
	export const PREFIX = '/import'

	export const markdown: Route<ImportSchema.markdown> = {
		method: 'POST',
		path: '/markdown',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor', field: 'pageId' })],
		schema: ImportSchema.markdown,
		handler: ImportController.markdown,
	}

	export const bms: Route<ImportSchema.bms> = {
		method: 'POST',
		path: '/bms',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor', field: 'pageId' })],
		schema: ImportSchema.bms,
		handler: ImportController.bms,
	}
}
