import { MongoDB } from '@notice-app/mongodb'
import { Postgres } from '@notice-app/postgres'
import { Handler } from 'typerestjs'
import { WorkspaceSchema } from '../schemas/workspace.schema'
import { PermissionService } from '../services/permission.service'
import { SubscriptionService } from '../services/subscription.service'
import { WorkspaceService } from '../services/workspace.service'

export namespace WorkspaceController {
	export const getAll: Handler<WorkspaceSchema.getAll> = async (req, reply) => {
		const workspaces = await WorkspaceService.getUserWorkspaces(req.user.id)
		return reply.success(200, workspaces)
	}

	export const createOne: Handler<WorkspaceSchema.createOne> = async (req, reply) => {
		const workspace = await WorkspaceService.createWorkspace(req.body.name)
		await PermissionService.setWorkspaceOwner(req.user.id, workspace.id)

		return reply.success(201, {
			...workspace,
			subscription: 'free',
			myRole: 'owner',
		})
	}

	export const update: Handler<WorkspaceSchema.update> = async (req, reply) => {
		const exists = await WorkspaceService.exists(req.params.workspaceId)
		if (!exists) return reply.error(404, 'workspace_not_found')

		await WorkspaceService.update(req.params.workspaceId, req.body)

		return reply.success(200)
	}

	export const deleteOne: Handler<WorkspaceSchema.deleteOne> = async (req, reply) => {
		const exists = await WorkspaceService.exists(req.params.workspaceId)
		if (!exists) return reply.success(200)

		// Must not have a subscription (mandatory)
		const subscription = await SubscriptionService.getSubscription(req.params.workspaceId)
		if (subscription?.userId) {
			if (subscription.expiresAt == null) {
				return reply.error(
					409,
					'could_not_delete',
					'Before deleting your workspace, please make sure you have no active subscription.'
				)
			}
		}

		// Must be alone in the workspace (optionnal)
		const collaboratorsCount = await WorkspaceService.countActiveCollaborators(req.params.workspaceId)
		if (collaboratorsCount > 1) {
			return reply.error(
				409,
				'could_not_delete',
				'Apologies, but you cannot delete a workspace that still has collaborators associated with it.'
			)
		}

		// Must keep one owned workspace (mandatory)
		const workspacesCount = await WorkspaceService.countUserOwnWorkspaces(req.user.id)
		if (workspacesCount <= 1) {
			return reply.error(409, 'could_not_delete', 'Apologies, but you cannot delete your last own workspace.')
		}

		// Must not have any projects
		const projectsCount = await MongoDB.blocks.countDocuments({ workspaceId: req.params.workspaceId, isRoot: true })
		if (projectsCount > 0) {
			return reply.error(
				409,
				'could_not_delete',
				'Before deleting your workspace, please make sure you have no projects associated with it.'
			)
		}

		await WorkspaceService.deleteOne(req.params.workspaceId)

		if (subscription && !subscription.userId) await SubscriptionService.deleteOne(subscription.id)

		return reply.success(200)
	}

	export const getWorkspaceInfos: Handler<WorkspaceSchema.getWorkspaceInfos> = async (req, reply) => {
		const infos = await WorkspaceService.getWorkspaceInfos(req.params.workspaceId)
		if (!infos) return reply.error(404, 'workspace_infos_not_found')

		return reply.success(200, infos)
	}
}
