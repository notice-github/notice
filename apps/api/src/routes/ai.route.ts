import { Route } from 'typerestjs'
import { AIController } from '../controllers/ai.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { OpenAIMiddleware } from '../middlewares/openai.middleware'
import { AISchema } from '../schemas/ai.schema'
import { SubscriptionMiddleware } from '../middlewares/subscription.middleware'

export namespace AIRoute {
	export const PREFIX = '/ai'

	export const rephrase: Route<AISchema.rephrase> = {
		method: 'POST',
		path: '/rephrase',
		middlewares: [
			OpenAIMiddleware.normalize('body', 'text'),
			OpenAIMiddleware.moderate('body', 'text'),
			GuardMiddleware.workspace({ role: 'editor', source: 'query' }),
			SubscriptionMiddleware.limitAIAssistant({ workspaceFrom: 'query' }),
		],
		schema: AISchema.rephrase,
		handler: AIController.rephrase,
	}

	export const generateImage: Route<AISchema.generateImage> = {
		method: 'POST',
		path: '/generate/image',
		middlewares: [
			OpenAIMiddleware.moderate('body', 'description'),
			GuardMiddleware.workspace({ role: 'editor', source: 'query' }),
			SubscriptionMiddleware.limitAIAssistant({ workspaceFrom: 'query' }),
		],
		schema: AISchema.generateImage,
		handler: AIController.generateImage,
	}

	export const imageSuggestion: Route<AISchema.imageSuggestion> = {
		method: 'POST',
		path: '/image/suggestion',
		middlewares: [
			OpenAIMiddleware.moderate('body', 'description'),
			GuardMiddleware.workspace({ role: 'editor', source: 'query' }),
		],
		schema: AISchema.imageSuggestion,
		handler: AIController.imageSuggestion,
	}

	export const generatePage: Route<AISchema.generatePage> = {
		method: 'POST',
		path: '/page',
		middlewares: [
			OpenAIMiddleware.moderate('body', 'prompt'),
			GuardMiddleware.workspace({ role: 'editor', source: 'query' }),
			SubscriptionMiddleware.limitAIAssistant({ workspaceFrom: 'query' }),
		],
		schema: AISchema.generatePage,
		handler: AIController.generatePage,
	}
}
