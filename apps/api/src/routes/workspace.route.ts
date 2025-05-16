import { Route } from 'typerestjs'
import { WorkspaceController } from '../controllers/workspace.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { WorkspaceSchema } from '../schemas/workspace.schema'

export namespace WorkspaceRoute {
	export const PREFIX = '/workspaces'

	export const getAll: Route<WorkspaceSchema.getAll> = {
		method: 'GET',
		path: '/',
		middlewares: [GuardMiddleware.connected()],
		schema: WorkspaceSchema.getAll,
		handler: WorkspaceController.getAll,
	}

	export const createOne: Route<WorkspaceSchema.createOne> = {
		method: 'POST',
		path: '/',
		middlewares: [GuardMiddleware.connected()],
		schema: WorkspaceSchema.createOne,
		handler: WorkspaceController.createOne,
	}

	export const update: Route<WorkspaceSchema.update> = {
		method: 'PATCH',
		path: '/:workspaceId',
		middlewares: [GuardMiddleware.workspace({ role: 'admin', source: 'params' })],
		schema: WorkspaceSchema.update,
		handler: WorkspaceController.update,
	}

	export const deleteOne: Route<WorkspaceSchema.deleteOne> = {
		method: 'DELETE',
		path: '/:workspaceId',
		middlewares: [GuardMiddleware.workspace({ role: 'owner', source: 'params' })],
		schema: WorkspaceSchema.deleteOne,
		handler: WorkspaceController.deleteOne,
	}

	export const getWorkspaceInfos: Route<WorkspaceSchema.getWorkspaceInfos> = {
		method: 'GET',
		path: '/:workspaceId/info',
		middlewares: [GuardMiddleware.connected()],
		schema: WorkspaceSchema.getWorkspaceInfos,
		handler: WorkspaceController.getWorkspaceInfos,
	}
}
