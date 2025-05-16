import { Route } from 'typerestjs'
import { SaverController } from '../controllers/saver.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { SaverSchema } from '../schemas/saver.schema'

export namespace SaverRoute {
	export const PREFIX = '/savers'

	export const slate: Route<SaverSchema.slate> = {
		method: 'POST',
		path: '/slate',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor', field: 'id' })],
		schema: SaverSchema.slate,
		handler: SaverController.slate,
	}
}
