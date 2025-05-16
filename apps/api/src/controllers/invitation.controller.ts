import { NUrls } from '@notice-app/tools'
import { Handler } from 'typerestjs'
import { Email } from '../plugins/email.plugin'
import { InvitationSchema } from '../schemas/invitation.schema'
import { AuthService } from '../services/auth.service'
import { PermissionService } from '../services/permission.service'
import { WorkspaceService } from '../services/workspace.service'
import { Consts } from '../tools/consts'

export namespace InvitationController {
	export const getAll: Handler<InvitationSchema.getAll> = async (req, reply) => {
		const invitations = await WorkspaceService.getInvitations(req.query.workspaceId)
		return reply.success(200, invitations)
	}

	export const create: Handler<InvitationSchema.create> = async (req, reply) => {
		if (Consts.ROLE_ID[req.user.role!] > Consts.ROLE_ID[req.body.role]) return reply.error(403, 'not_allowed')

		const currentInvitation = await WorkspaceService.getInvitation(req.query.workspaceId, req.body.email)
		if (currentInvitation != null) {
			return reply.error(409, 'already_invited', `${req.body.email} already has an invitation to join your workspace`)
		}

		const invitation = await WorkspaceService.addCollaborator(req.query.workspaceId, req.body.email, req.body.role)
		Email.send({
			templateId: 'workspace-invitation',
			to: req.body.email,
			subject: 'Invitation to collaborate',
			params: {
				link: `${NUrls.App.client()}/editor/invitation?token=${AuthService.generateInvitationToken(
					invitation.id,
					req.body.email
				)}`,
				username: req.user.username,
			},
		})

		return reply.success(202)
	}

	export const getWorkspace: Handler<InvitationSchema.getWorkspace> = async (req, reply) => {
		const payload = AuthService.verifyInvitationToken(req.query.token)
		if (typeof payload === 'string') return reply.error(400, payload)

		const workspace = await WorkspaceService.getByPermission(payload.id)
		if (workspace == null) return reply.error(404, 'workspace_not_found')

		return reply.success(200, workspace)
	}

	export const acceptOrRefuse: Handler<InvitationSchema.acceptOrRefuse> = async (req, reply) => {
		const payload = AuthService.verifyInvitationToken(req.body.token)
		if (typeof payload === 'string') return reply.error(400, payload)

		const workspace = await WorkspaceService.getByPermission(payload.id)
		if (workspace == null) return reply.error(404, 'workspace_not_found')

		if (req.params.action === 'refuse') {
			await PermissionService.update(payload.id, { invitationStatus: 'refused' })
			return reply.success(200, undefined)
		} else {
			await PermissionService.update(payload.id, { invitationStatus: 'accepted', userId: req.user.id })

			return reply.success(200, workspace)
		}
	}

	export const update: Handler<InvitationSchema.update> = async (req, reply) => {
		const permission = await PermissionService.getById(req.params.permissionId)
		if (permission == null) return reply.error(404, 'invitation_not_found')

		if (
			req.body.role != null &&
			(Consts.ROLE_ID[req.user.role!] > Consts.ROLE_ID[req.body.role] ||
				Consts.ROLE_ID[req.user.role!] > Consts.ROLE_ID[permission.role])
		) {
			return reply.error(403, 'not_allowed')
		}

		await PermissionService.update(permission.id, req.body)

		return reply.success(200)
	}

	export const remove: Handler<InvitationSchema.remove> = async (req, reply) => {
		const permission = await PermissionService.getById(req.params.permissionId)
		if (permission == null) return reply.success(200)

		if (Consts.ROLE_ID[req.user.role!] > Consts.ROLE_ID[permission.role]) return reply.error(403, 'not_allowed')

		if (permission.invitationStatus == null || permission.invitationStatus === 'accepted') {
			return reply.error(403, 'not_allowed')
		}

		await PermissionService.remove(permission.id)

		return reply.success(200, undefined)
	}
}
