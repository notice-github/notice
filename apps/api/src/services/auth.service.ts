import { UserModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { NEnv, NTime } from '@notice-app/tools'
import crypto from 'crypto'
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { ServerReply, ServerRequest } from 'typerestjs'
import { Consts } from '../tools/consts'

export namespace AuthService {
	export const connect = (user: UserModel.full, reply: ServerReply, isFake: boolean = false) => {
		const token = jwt.sign({ id: user.id, ...(isFake ? { isFake: true } : {}) }, process.env.JWT_PRIVATE_KEY!, {
			expiresIn: '30d',
			algorithm: 'ES256',
			issuer: 'Notice',
		})

		const cookieSettings = NEnv.NODE_ENV === 'production' ? ({ secure: true, sameSite: 'none' } as const) : {}

		reply.custom().cookie('access-token', token, {
			domain: Consts.COOKIE_DOMAINS[NEnv.STAGE],
			path: '/',
			httpOnly: true,
			expires: NTime.$now().add(30, 'days').toDate(),
			sameSite: 'lax',
			...cookieSettings,
		})
	}

	export const verifyAccessToken = (req: ServerRequest) => {
		const accessToken = req.cookies['access-token']

		if (accessToken == null) return 'access_token_required'

		try {
			const payload = jwt.verify(accessToken, process.env.JWT_PUBLIC_KEY!, {
				issuer: 'Notice',
				algorithms: ['ES256'],
			}) as JwtPayload

			return { id: payload.id, isFake: payload.isFake ?? false }
		} catch (ex) {
			if (ex instanceof TokenExpiredError) return 'access_token_expired'
			return 'access_token_invalid'
		}
	}

	export const generateCode = () => {
		let code = ''
		for (let i = 0; i < 6; i++) {
			code += crypto.randomInt(10).toString()
		}
		return code
	}

	export const insertEmailCode = async (email: string, code: string) => {
		await Postgres.codes().insert({
			id: Postgres.uuid(),
			code: code,
			email: email,
			expiresAt: NTime.$now().add(15, 'minutes').toDate(),
		})
	}

	export const checkEmailCode = async (email: string, code: string) => {
		const data = await Postgres.codes()
			.where({
				code: code,
				email: email,
			})
			.andWhere('expiresAt', '>', NTime.now())
			.first()

		return data != null
	}

	export const deleteEmailCodes = async (email: string) => {
		await Postgres.codes().where('email', email).delete()
	}

	export const disconnect = (reply: ServerReply<any>) => {
		const cookieSettings = NEnv.NODE_ENV === 'production' ? ({ secure: true, sameSite: 'none' } as const) : {}

		reply.custom().clearCookie('access-token', {
			domain: Consts.COOKIE_DOMAINS[NEnv.STAGE],
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			...cookieSettings,
		})
	}

	export const generateInvitationToken = (permissionId: string, email: string) => {
		const token = jwt.sign({ id: permissionId, email: email }, process.env.JWT_PRIVATE_KEY!, {
			audience: 'invitation',
			expiresIn: '7d',
			algorithm: 'ES256',
			issuer: 'Notice',
		})

		return token
	}

	export const verifyInvitationToken = (token: string) => {
		try {
			const cleanedToken = token?.split('?')[0]
			const payload = jwt.verify(cleanedToken, process.env.JWT_PUBLIC_KEY!, {
				audience: 'invitation',
				issuer: 'Notice',
				algorithms: ['ES256'],
			}) as JwtPayload

			return { id: payload.id, email: payload.email }
		} catch (ex) {
			if (ex instanceof TokenExpiredError) return 'invitation_token_expired'
			return 'invitation_token_invalid'
		}
	}
}
