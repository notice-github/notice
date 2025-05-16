import { Postgres } from '@notice-app/postgres'
import { NTime, NUrls } from '@notice-app/tools'
import { Handler } from 'typerestjs'
import { Email } from '../plugins/email.plugin'
import { AuthSchema } from '../schemas/auth.schema'
import { AuthService } from '../services/auth.service'
import { FileService } from '../services/file.service'
import { PermissionService } from '../services/permission.service'
import { UserService } from '../services/user.service'
import { WorkspaceService } from '../services/workspace.service'
import { Consts } from '../tools/consts'
import { Utils } from '../tools/utils'

export namespace AuthController {
	export const auth: Handler<AuthSchema.auth> = async (req, reply) => {
		const { source, next } = req.query
		const { provider, user } = req.auth

		let sourceURL: URL
		try {
			sourceURL = new URL(source!)
		} catch (ex) {
			sourceURL = new URL(`${NUrls.App.client()}/signin`)
		}

		if (user == null) {
			if (provider === 'email') {
				return reply.error(401, 'wrong_code')
			} else {
				const redirectURL = new URL(sourceURL.href)
				redirectURL.searchParams.set('error', 'true') // TODO : add better error
				return reply.custom().redirect(redirectURL.href)
			}
		}

		let dbUser = await UserService.getByAuth(provider, provider === 'email' ? user.email : user.id)
		if (dbUser == null && provider !== 'email') {
			dbUser = await UserService.getByAuth('email', user.email)
			if (dbUser != null && dbUser[`${provider}Id`] == null) {
				await Postgres.users()
					.where('id', dbUser.id)
					.update({ [`${provider}Id`]: user.id })
			}
		}

		if (dbUser == null) {
			const username = Utils.emailToName(user.email)

			dbUser = await UserService.create({
				email: user.email,
				username: username,
				...(provider !== 'email' && {
					picture: user.picture ?? null,
					[`${req.auth.provider}Id`]: user.id,
				}),
			})

			// Normally Impossible
			if (dbUser == null) throw new Error('Internal server error')

			if ('picture' in user && user.picture != null) {
				const file = await FileService.upload(user.picture, { userId: dbUser.id, mimetype: 'image/png' })
				await UserService.update(dbUser.id, { picture: file.url })
			}
		}

		if (!(await WorkspaceService.userHasHisOwnWorkspace(dbUser.id))) {
			const name = dbUser.username.split(' ')[0]

			const license = await Postgres.licenses().select('id', 'planId').where('activationEmail', dbUser.email).first()

			const workspace = await WorkspaceService.createWorkspace(
				`${name}'${name[name.length - 1] !== 's' ? 's' : ''} workspace`,
				{ tokenBalance: license?.planId === 'notice_tier2' ? 30_000 : 10_000 }
			)
			await PermissionService.setWorkspaceOwner(dbUser.id, workspace.id)

			if (license != null) {
				await Postgres.licenses().where('id', license.id).update({ workspaceId: workspace.id })
				await Postgres.subscriptions().insert({
					id: Postgres.uuid(),
					type: Consts.PLAN_TO_TYPE[license.planId],
					billingCycle: 'lifetime',
					userId: dbUser.id,
					workspaceId: workspace.id,
				})
			} else {
				await Postgres.subscriptions().insert({
					id: Postgres.uuid(),
					type: 'essential',
					billingCycle: 'monthly',
					userId: dbUser.id,
					workspaceId: workspace.id,
					isFreeTrial: true,
					expiresAt: NTime.$now().add(14, 'days').toDate(),
				})
			}
		}

		AuthService.connect(dbUser, reply)

		if (provider === 'email') return reply.success(200)
		else {
			if (sourceURL.host === new URL(NUrls.Admin.client()).host) {
				return reply.custom().redirect(`${NUrls.Admin.client()}${next ?? '/'}`)
			} else {
				return reply.custom().redirect(`${NUrls.App.client()}${next ?? '/'}`)
			}
		}
	}

	export const resend: Handler<AuthSchema.resend> = async (req, reply) => {
		const { email } = req.body

		const code = AuthService.generateCode()

		await AuthService.insertEmailCode(email, code)

		await Email.sendAuthCode({
			to: email,
			params: { code: code },
		})

		return reply.success(201)
	}

	export const link: Handler<AuthSchema.link> = async (req, reply) => {
		const { next } = req.query
		const { provider } = req.auth

		const redirectURL = new URL(`${NUrls.App.client()}${next ?? '/'}`)

		if (!req.auth.user || provider === 'email') {
			redirectURL.searchParams.set('error', 'unknown_error')
			return reply.custom().redirect(redirectURL.href)
		}

		const exists = await UserService.getByAuth(provider, req.auth.user.id)
		if (exists) {
			redirectURL.searchParams.set('error', `${provider}_already_linked`)
			return reply.custom().redirect(redirectURL.href)
		}

		await Postgres.users()
			.where('id', req.user.id)
			.update({ [`${provider}Id`]: req.auth.user.id })

		return reply.custom().redirect(302, redirectURL.href)
	}

	export const unlink: Handler<AuthSchema.unlink> = async (req, reply) => {
		const provider = `${req.params.provider}Id` as const

		if (req.user[provider] == null) return reply.error(404, 'provider_not_linked')

		await Postgres.users()
			.where('id', req.user.id)
			.update({ [provider]: null })

		return reply.success(200)
	}

	export const disconnect: Handler = async (req, reply) => {
		AuthService.disconnect(reply)
		return reply.success(200)
	}
}
