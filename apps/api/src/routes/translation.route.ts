import { Route } from 'typerestjs'
import { TranslationController } from '../controllers/translation.controller'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { TranslationSchema } from '../schemas/translation.schema'

export namespace TranslationRoute {
	export const PREFIX = '/translation'

	export const slate: Route<TranslationSchema.updateOne> = {
		method: 'PATCH',
		path: '/:blockId',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: TranslationSchema.updateOne,
		handler: TranslationController.updateOne,
	}

	export const updatePageTitle: Route<TranslationSchema.updatePageTitle> = {
		method: 'PATCH',
		path: '/:blockId/title',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: TranslationSchema.updatePageTitle,
		handler: TranslationController.updatePageTitle,
	}

	export const markComplete: Route<TranslationSchema.markComplete> = {
		method: 'PATCH',
		path: '/:blockId/complete',
		middlewares: [AuthMiddleware.fromBlock({ role: 'editor' })],
		schema: TranslationSchema.markComplete,
		handler: TranslationController.markComplete,
	}
}
