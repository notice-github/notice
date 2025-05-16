import { Route } from 'typerestjs'
import { EmailSchema } from '../schemas/email.schema'
import { EmailController } from '../controllers/email.controller'

export namespace EmailRoute {
	export const PREFIX = '/emails'

	export const unsubscribe: Route<EmailSchema.unsubscribe> = {
		method: 'GET',
		path: '/unsubscribe',
		schema: EmailSchema.unsubscribe,
		handler: EmailController.unsubscribe,
	}

	export const resubscribe: Route<EmailSchema.resubscribe> = {
		method: 'GET',
		path: '/resubscribe',
		schema: EmailSchema.resubscribe,
		handler: EmailController.resubscribe,
	}
}
