import { Route } from 'typerestjs'
import { GetterController } from '../controllers/getter.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { GetterSchema } from '../schemas/getter.schema'

export namespace GetterRoute {
	export const PREFIX = '/getters'

	export const slate: Route<GetterSchema.slate> = {
		method: 'GET',
		path: '/slate',
		middlewares: [AuthMiddleware.fromBlock({ role: 'viewer' })],
		schema: GetterSchema.slate,
		handler: GetterController.slate,
	}
}
