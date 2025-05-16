import { Route } from 'typerestjs'
import { CollaboratorController } from '../controllers/collaborator.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { CollaboratorSchema } from '../schemas/collaborator.schema'

export namespace CollaboratorRoute {
	export const PREFIX = '/collaborators'

	export const getAll: Route<CollaboratorSchema.getAll> = {
		method: 'GET',
		path: '/',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'query' })],
		schema: CollaboratorSchema.getAll,
		handler: CollaboratorController.getAll,
	}

	export const update: Route<CollaboratorSchema.update> = {
		method: 'PATCH',
		path: '/:userId',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'query' })],
		schema: CollaboratorSchema.update,
		handler: CollaboratorController.update,
	}

	export const remove: Route<CollaboratorSchema.remove> = {
		method: 'DELETE',
		path: '/:userId',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'query' })],
		schema: CollaboratorSchema.remove,
		handler: CollaboratorController.remove,
	}
}
