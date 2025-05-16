import { Route } from 'typerestjs'
import { TranslateController } from '../controllers/translate.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { TranslateSchema } from '../schemas/translate.schema'
import { SimpleRateLimitMiddleware } from '../plugins/simple-rate-limit.middleware'

export namespace TranslateRoute {
	export const PREFIX = '/translate'

	export const text: Route<TranslateSchema.text> = {
		method: 'POST',
		path: '/text',
		middlewares: [
			GuardMiddleware.connected(),
			SimpleRateLimitMiddleware.rateLimit({
				max: 180,
				timeWindow: 60 * 1000, // 1 minute in milliseconds
			}),
		],
		schema: TranslateSchema.text,
		handler: TranslateController.text,
	}

	export const texts: Route<TranslateSchema.texts> = {
		method: 'POST',
		path: '/texts',
		middlewares: [
			GuardMiddleware.connected(),
			SimpleRateLimitMiddleware.rateLimit({
				max: 180,
				timeWindow: 60 * 1000, // 1 minute in milliseconds
			}),
		],
		schema: TranslateSchema.texts,
		handler: TranslateController.texts,
	}

	export const page: Route<TranslateSchema.page> = {
		method: 'POST',
		path: '/page',
		middlewares: [GuardMiddleware.connected()],
		schema: TranslateSchema.page,
		handler: TranslateController.page,
	}
}
