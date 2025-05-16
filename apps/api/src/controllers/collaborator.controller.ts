import { Handler, Logger } from 'typerestjs'
import { CollaboratorSchema } from '../schemas/collaborator.schema'
import { PermissionService } from '../services/permission.service'
import { SubscriptionService } from '../services/subscription.service'
import { WorkspaceService } from '../services/workspace.service'

export namespace CollaboratorController {
	export const getAll: Handler<CollaboratorSchema.getAll> = async (req, reply) => {
		const collaborators = await WorkspaceService.getCollaborators(req.query.workspaceId)
		return reply.success(200, collaborators)
	}

	export const update: Handler<CollaboratorSchema.update> = async (req, reply) => {
		const permission = await PermissionService.getUserPermission(req.params.userId, req.query.workspaceId)
		if (permission == null) return reply.error(404, 'collaborator_not_found')

		if (permission.userId === req.user.id) return reply.error(403, 'not_allowed')

		const isCreator = permission.role === 'owner' && permission.invitationStatus == null
		if (isCreator) reply.error(403, 'not_allowed')

		await PermissionService.update(permission.id, req.body)

		return reply.success(200)
	}

	export const remove: Handler<CollaboratorSchema.remove> = async (req, reply) => {
		const permission = await PermissionService.getUserPermission(req.params.userId, req.query.workspaceId)
		if (permission == null) return reply.success(200)

		if (permission.userId === req.user.id) return reply.error(403, 'not_allowed')

		const isCreator = permission.role === 'owner' && permission.invitationStatus == null
		if (isCreator) reply.error(403, 'not_allowed')

		await PermissionService.remove(permission.id)

		return reply.success(200)
	}
}
