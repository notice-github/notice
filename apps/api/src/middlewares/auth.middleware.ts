import { BMSBlockModel, PermissionModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { Postgres } from '@notice-app/postgres'
import { NUrls } from '@notice-app/tools'
import axios from 'axios'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { Is, Logger, Middleware, ServerReply, ServerRequest } from 'typerestjs'
import { Email } from '../plugins/email.plugin'
import { AuthService } from '../services/auth.service'
import { BlockService } from '../services/block.service'
import { OAuthService } from '../services/oauth.service'
import { UserService } from '../services/user.service'
import { Consts } from '../tools/consts'

declare module 'typerestjs' {
	interface ServerRequest {
		block: BMSBlockModel.block
		auth:
			| {
					provider: OAuthService.Provider
					user?: {
						id: string
						name: string
						email: string
						picture?: string
					}
			  }
			| {
					provider: 'email'
					user?: {
						email: string
					}
			  }
	}
}

export namespace AuthMiddleware {
	export const openAuth = (type: 'auth' | 'link', _provider?: OAuthService.Provider): Middleware => {
		return async (req, reply) => {
			const provider = _provider ?? (req.params.provider as OAuthService.Provider)

			try {
				const { code, state, scope, ...passthrough } = req.query

				const oauthProvider = OAuthService.providers[provider]

				if (code == null) {
					const authorizationUri = oauthProvider.client.authorizeURL({
						redirect_uri: `${NUrls.App.api()}/auth/${provider}${type === 'link' ? '/link' : ''}`,
						scope: oauthProvider.scopes,
						state: JSON.stringify(passthrough),
					})

					return reply.custom().redirect(authorizationUri)
				}

				try {
					req.query = { ...req.query, ...JSON.parse(state) }
				} catch (ex) {}

				const { token } = await oauthProvider.client.getToken({
					code: code,
					redirect_uri: `${NUrls.App.api()}/auth/${provider}${type === 'link' ? '/link' : ''}`,
					scope: oauthProvider.scopes,
				})

				let { data: userData } = await axios.get(oauthProvider.userURL, {
					headers: {
						Authorization: `Bearer ${token['access_token']}`,
					},
				})

				// Little exception for github, we need to make another call to get the email
				if (provider === 'github') {
					const { data: emails } = await axios.get('https://api.github.com/user/emails', {
						headers: {
							Authorization: `Bearer ${token['access_token']}`,
						},
					})
					userData.email = emails.find((email: { primary: boolean }) => email.primary === true).email
				}

				req.auth = {
					provider: provider,
					user: OAuthService.normalizeUserData(userData, provider),
				}
			} catch (ex) {
				req.auth = { provider: provider }
			}
		}
	}

	export const emailAuth = (): Middleware => {
		return async (req, reply) => {
			try {
				let { email, code } = req.body

				const user = await UserService.getByAuth('email', email)

				email = email.toLowerCase()
				if (!Is.string().email().safeParse(email).success) return reply.error('400', 'invalid')

				if (code == null) {
					code = AuthService.generateCode()

					try {
						await AuthService.insertEmailCode(email, code)
						await Email.sendAuthCode({
							to: email,
							params: { code: code },
						})
					} catch (ex: any) {
						Logger.error('email', ex)
					}

					return reply.success('202', undefined)
				}

				const isValid = await AuthService.checkEmailCode(email, code)
				if (isValid) {
					await AuthService.deleteEmailCodes(email)
					req.auth = {
						provider: 'email',
						user: {
							email: email.toLowerCase(),
						},
					}
				} else {
					req.auth = { provider: 'email' }
				}
			} catch (ex) {
				req.auth = { provider: 'email' }
			}
		}
	}

	const getUser = async (req: ServerRequest, reply: ServerReply) => {
		try {
			const payload = jwt.verify(req.cookies['access-token']!, process.env.JWT_PUBLIC_KEY!, {
				issuer: 'Notice',
				algorithms: ['ES256'],
			}) as JwtPayload

			if (payload?.id == null) throw new Error('invalid_payload')

			const user = await UserService.getById(payload.id)
			if (user == null) return reply.error(401, 'access_token_invalid')

			req.user = user

			return req.user
		} catch (ex) {
			const expired = ex instanceof TokenExpiredError

			console.error(ex)

			reply.error(401, expired ? 'token_expired' : 'invalid_token')

			return null
		}
	}

	export const getPermissions = async (req: ServerRequest<any>, reply: ServerReply<any>) => {
		if (req.headers['x-api-key'] != null) {
			const apiKey = await MongoDB.api_keys.findOne({ key: req.headers['x-api-key'] })
			if (apiKey == null) return reply.error(401, 'invalid_api_key')

			return [{ workspaceId: apiKey.workspaceId, role: apiKey.role }]
		}

		const user = await getUser(req, reply)
		if (user == null) return null

		const permissions = await Postgres.permissions()
			.select('workspaceId', 'role')
			.where('userId', user.id)
			.where((builder) => builder.where('invitationStatus', 'accepted').orWhereNull('invitationStatus'))

		return permissions.map((perm) => ({ workspaceId: perm.workspaceId, role: perm.role }))
	}

	export const fromWorkspace = (options?: { role: PermissionModel.roles }): Middleware => {
		return async (req, reply) => {
			if (process.env.STAGE === 'testing') return

			const workspaceId = req.query.workspaceId ?? req.params.workspaceId ?? req.body.workspaceId
			if (workspaceId == null) return

			const permissions = await getPermissions(req, reply)
			if (permissions == null) return

			const allowed =
				permissions.find((permission) => {
					if (permission.workspaceId !== '*' && permission.workspaceId !== workspaceId) return false
					if (Consts.ROLE_ID[permission.role] > Consts.ROLE_ID[options?.role ?? 'viewer']) return false
					return true
				}) != undefined

			if (!allowed) return reply.error(403, 'not_allowed')

			return
		}
	}

	export const fromBlock = (options?: {
		role: PermissionModel.roles
		field?: '_id' | 'id' | 'blockId' | 'projectId' | 'parentId' | 'pageId'
		isDeleted?: boolean | null
	}): Middleware => {
		return async (req, reply) => {
			if (process.env.STAGE === 'testing') return

			const blockId =
				req.params[options?.field ?? 'blockId'] ??
				req.body[options?.field ?? 'blockId'] ??
				req.query[options?.field ?? 'blockId']

			const block = await BlockService.getOne(blockId, { isDeleted: options?.isDeleted })
			if (block == null) return reply.error(404, 'block_not_found')

			req.block = block

			const permissions = await getPermissions(req, reply)
			if (permissions == null) return

			const allowed =
				permissions.find((permission) => {
					if (permission.workspaceId !== '*' && permission.workspaceId !== block.workspaceId) return false
					if (Consts.ROLE_ID[permission.role] > Consts.ROLE_ID[options?.role ?? 'viewer']) return false
					return true
				}) != undefined

			if (!allowed) return reply.error(403, 'not_allowed')
		}
	}
}
