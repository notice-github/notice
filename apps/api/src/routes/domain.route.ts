import { Route } from 'typerestjs'
import { DomainController } from '../controllers/domain.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { DomainSchema } from '../schemas/domain.schema'

export namespace DomainRoute {
	export const PREFIX = '/domain'

	export const checkAvailability: Route<DomainSchema.checkAvailability> = {
		method: 'POST',
		path: '/check/availability',
		middlewares: [AuthMiddleware.fromWorkspace({ role: 'editor' })],
		schema: DomainSchema.checkAvailability,
		handler: DomainController.checkAvailability,
	}

	export const checkDNS: Route<DomainSchema.checkDNS> = {
		method: 'POST',
		path: '/check/dns',
		middlewares: [AuthMiddleware.fromWorkspace({ role: 'editor' })],
		schema: DomainSchema.checkDNS,
		handler: DomainController.checkDNS,
	}

	export const setup: Route<DomainSchema.setup> = {
		method: 'POST',
		path: '/:blockId/setup',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: DomainSchema.setup,
		handler: DomainController.setup,
	}

	export const apply: Route<DomainSchema.apply> = {
		method: 'POST',
		path: '/:blockId/apply',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: DomainSchema.apply,
		handler: DomainController.apply,
	}

	export const remove: Route<DomainSchema.remove> = {
		method: 'DELETE',
		path: '/:blockId',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: DomainSchema.remove,
		handler: DomainController.remove,
	}
}
