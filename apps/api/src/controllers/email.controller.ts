import fs from 'fs/promises'
import { Handler } from 'typerestjs'
import { Email } from '../plugins/email.plugin'
import { EmailSchema } from '../schemas/email.schema'
import { Consts } from '../tools/consts'

export namespace EmailController {
	export const unsubscribe: Handler<EmailSchema.unsubscribe> = async (req, reply) => {
		try {
			if (!req.query.email || !Consts.EMAIL_REGEX.test(req.query.email)) throw new Error('invalid_email')

			await Email.unsubscribe(req.query.email)

			const emailTemplate = await fs.readFile('./assets/unsubscribe.html', 'utf-8')

			return reply
				.custom()
				.status(200)
				.header('Content-Type', 'text/html')
				.send(emailTemplate.replace(/{{email}}/g, encodeURIComponent(req.query.email)))
		} catch (_) {
			return reply.custom().status(404).send()
		}
	}

	export const resubscribe: Handler<EmailSchema.resubscribe> = async (req, reply) => {
		const emailTemplate = await fs.readFile('./assets/resubscribe.html', 'utf-8')

		try {
			if (!req.query.email || !Consts.EMAIL_REGEX.test(req.query.email)) throw new Error('invalid_email')

			await Email.subscribe(req.query.email)
		} catch (_) {}

		return reply.custom().status(200).header('Content-Type', 'text/html').send(emailTemplate)
	}
}
