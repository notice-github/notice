import { Route } from 'typerestjs'
import { TemplateController } from '../controllers/template.controller'
import { GuardMiddleware } from '../middlewares/guard.middleware'
import { TemplateSchema } from '../schemas/template.schema'
import { SubscriptionMiddleware } from '../middlewares/subscription.middleware'

export namespace OnboardingRoute {
	export const PREFIX = '/template'

	export const generation: Route<TemplateSchema.generation> = {
		method: 'POST',
		path: '/generation',
		middlewares: [GuardMiddleware.connected(), SubscriptionMiddleware.limitProjectCreation({ workspaceFrom: 'query' })],
		schema: TemplateSchema.generation,
		handler: TemplateController.generation,
	}

	export const design: Route<TemplateSchema.design> = {
		method: 'POST',
		path: '/getDesign',
		middlewares: [GuardMiddleware.connected()],
		schema: TemplateSchema.design,
		handler: TemplateController.getDesign,
	}
}
