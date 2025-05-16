import { Route } from 'typerestjs'
import { WebhookController } from '../controllers/webhook.controller'
import { WebhookSchema } from '../schemas/webhook.schema'

export namespace WebhookRoute {
	export const PREFIX = '/webhooks'

	export const stripe: Route<WebhookSchema.stripe> = {
		method: 'POST',
		path: '/stripe',
		schema: WebhookSchema.stripe,
		handler: WebhookController.stripe,
		config: {
			rawBody: true,
		},
	}
}
