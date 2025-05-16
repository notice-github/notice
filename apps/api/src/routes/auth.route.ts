import { Route } from 'typerestjs'
import { AuthController } from '../controllers/auth.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { SimpleRateLimitMiddleware } from '../plugins/simple-rate-limit.middleware'
import { AuthSchema } from '../schemas/auth.schema'

export namespace AuthRoute {
	export const PREFIX = '/auth'

	export const email: Route<AuthSchema.auth> = {
		method: 'POST',
		path: '/email',
		middlewares: [
			AuthMiddleware.emailAuth(),
			SimpleRateLimitMiddleware.rateLimit({
				max: 3,
				timeWindow: 60 * 1000, // 1 minute in milliseconds
			}),
		],
		schema: AuthSchema.auth,
		handler: AuthController.auth,
	}

	export const google: Route<AuthSchema.auth> = {
		method: 'GET',
		path: '/google',
		middlewares: [AuthMiddleware.openAuth('auth', 'google')],
		schema: AuthSchema.auth,
		handler: AuthController.auth,
	}

	export const github: Route<AuthSchema.auth> = {
		method: 'GET',
		path: '/github',
		middlewares: [AuthMiddleware.openAuth('auth', 'github')],
		schema: AuthSchema.auth,
		handler: AuthController.auth,
	}

	export const resend: Route<AuthSchema.resend> = {
		method: 'POST',
		path: '/email/resend',
		schema: AuthSchema.resend,
		handler: AuthController.resend,
		middlewares: [
			SimpleRateLimitMiddleware.rateLimit({
				max: 1,
				timeWindow: 60 * 1000, // 1 minute in milliseconds
			}),
		],
	}

	export const link: Route<AuthSchema.link> = {
		method: 'GET',
		path: '/:provider/link',
		middlewares: [AuthMiddleware.openAuth('link'), GuardMiddleware.connected()],
		schema: AuthSchema.link,
		handler: AuthController.link,
	}

	export const unlink: Route<AuthSchema.unlink> = {
		method: 'POST',
		path: '/:provider/unlink',
		middlewares: [GuardMiddleware.connected()],
		schema: AuthSchema.unlink,
		handler: AuthController.unlink,
	}

	export const disconnect: Route = {
		method: 'POST',
		path: '/disconnect',
		handler: AuthController.disconnect,
	}
}
