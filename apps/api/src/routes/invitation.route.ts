import { Route } from 'typerestjs'
import { InvitationController } from '../controllers/invitation.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { InvitationSchema } from '../schemas/invitation.schema'
import { SubscriptionMiddleware } from '../middlewares/subscription.middleware'

export namespace InvitationRoute {
	export const PREFIX = '/invitations'

	export const getAll: Route<InvitationSchema.getAll> = {
		method: 'GET',
		path: '/',
		middlewares: [GuardMiddleware.workspace({ role: 'viewer', source: 'query' })],
		schema: InvitationSchema.getAll,
		handler: InvitationController.getAll,
	}

	export const create: Route<InvitationSchema.create> = {
		method: 'POST',
		path: '/',
		middlewares: [
			GuardMiddleware.workspace({ role: 'editor', source: 'query' }),
			SubscriptionMiddleware.limitCollaborators({ workspaceFrom: 'query' }),
		],
		schema: InvitationSchema.create,
		handler: InvitationController.create,
	}

	export const getWorkspace: Route<InvitationSchema.getWorkspace> = {
		method: 'GET',
		path: '/workspace',
		middlewares: [GuardMiddleware.connected()],
		schema: InvitationSchema.getWorkspace,
		handler: InvitationController.getWorkspace,
	}

	export const acceptOrRefuse: Route<InvitationSchema.acceptOrRefuse> = {
		method: 'POST',
		path: '/:action',
		middlewares: [GuardMiddleware.connected()],
		schema: InvitationSchema.acceptOrRefuse,
		handler: InvitationController.acceptOrRefuse,
	}

	export const update: Route<InvitationSchema.update> = {
		method: 'PATCH',
		path: '/:permissionId',
		middlewares: [GuardMiddleware.workspace({ role: 'editor', source: 'query' })],
		schema: InvitationSchema.update,
		handler: InvitationController.update,
	}

	export const remove: Route<InvitationSchema.remove> = {
		method: 'DELETE',
		path: '/:permissionId',
		middlewares: [GuardMiddleware.workspace({ role: 'editor', source: 'query' })],
		schema: InvitationSchema.remove,
		handler: InvitationController.remove,
	}
}
