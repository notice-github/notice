import { Route } from 'typerestjs'
import { SubscriptionController } from '../controllers/subscription.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { SubscriptionSchema } from '../schemas/subscription.schema'

export namespace SubscriptionRoute {
	export const PREFIX = '/subscriptions'

	export const subscribe: Route<SubscriptionSchema.subscribe> = {
		method: 'POST',
		path: '/:workspaceId/subscribe',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: SubscriptionSchema.subscribe,
		handler: SubscriptionController.subscribe,
	}

	export const reactivate: Route<SubscriptionSchema.reactivate> = {
		method: 'POST',
		path: '/:workspaceId/reactivate',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: SubscriptionSchema.reactivate,
		handler: SubscriptionController.reactivate,
	}

	export const get: Route<SubscriptionSchema.get> = {
		method: 'GET',
		path: '/:workspaceId',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'params' })],
		schema: SubscriptionSchema.get,
		handler: SubscriptionController.get,
	}

	export const license: Route<SubscriptionSchema.license> = {
		method: 'GET',
		path: '/:workspaceId/license',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: SubscriptionSchema.license,
		handler: SubscriptionController.license,
	}
}
