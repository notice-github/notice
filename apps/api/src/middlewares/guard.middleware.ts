import { PermissionModel, UserModel } from '@notice-app/models'
import { NEnv } from '@notice-app/tools'
import { Middleware } from 'typerestjs'
import { AuthService } from '../services/auth.service'
import { PermissionService } from '../services/permission.service'
import { UserService } from '../services/user.service'
import { Consts } from '../tools/consts'

declare module 'typerestjs' {
	interface ServerRequest {
		user: UserModel.full & { role?: PermissionModel.roles; isFake?: boolean }
	}
}

export namespace GuardMiddleware {
	export const connected = (): Middleware => {
		return async (req, reply) => {
			const result = AuthService.verifyAccessToken(req)
			if (typeof result === 'string') return reply.error(401, result)

			const user = await UserService.getById(result.id)
			if (user == null) return reply.error(401, 'access_token_invalid')

			req.user = user
		}
	}

	export const workspace = (options: {
		role: PermissionModel.roles
		source: 'body' | 'query' | 'params'
	}): Middleware => {
		return async (req, reply) => {
			const workspaceId = req[options.source].workspaceId
			if (workspaceId == null) return // that will skip the middleware and trigger the schema validation

			const result = AuthService.verifyAccessToken(req)
			if (typeof result === 'string') return reply.error(401, result)

			const user = await UserService.getById(result.id)
			if (user == null) return reply.error(401, 'access_token_invalid')

			req.user = user

			const permission = await PermissionService.getUserPermission(user.id, workspaceId)

			if (permission == null) return reply.error(403, 'not_allowed')
			if (permission.invitationStatus != null && permission.invitationStatus !== 'accepted')
				return reply.error(403, 'not_allowed')
			if (Consts.ROLE_ID[permission.role] > Consts.ROLE_ID[options.role]) return reply.error(403, 'not_allowed')

			req.user.role = permission.role
		}
	}
}
