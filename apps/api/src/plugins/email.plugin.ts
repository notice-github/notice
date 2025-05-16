import {
	DeleteSuppressedDestinationCommand,
	PutSuppressedDestinationCommand,
	SESv2Client,
	SendEmailCommand,
	SuppressionListReason,
} from '@aws-sdk/client-sesv2'
import { NEnv } from '@notice-app/tools'
import dns from 'dns'
import { readFile } from 'fs/promises'
import { compile } from 'handlebars'
import mjml2html from 'mjml'
import { Logger } from 'typerestjs'
import { Consts } from '../tools/consts'

interface EmailSendParams {
	templateId: 'support-forwarded' | 'support' | 'workspace-invitation'
	to: string
	params?: any
	subject?: string
}

export namespace Email {
	const ses = new SESv2Client({
		region: 'eu-west-3',
		credentials: { accessKeyId: process.env.SES_KEY_ID!, secretAccessKey: process.env.SES_SECRET_KEY! },
	})

	const templates: { [key: string]: HandlebarsTemplateDelegate<any> } = {}

	export async function send({ templateId, to, params, subject }: EmailSendParams) {
		if (NEnv.NODE_ENV === 'development') {
			console.log('email', 'Email sent by API', { templateId, to, params, subject })
			return
		}

		if (templates[templateId] == null) {
			const content = await readFile(`./assets/emails/${templateId}.mjml`, 'utf-8')
			const mjml = mjml2html(content)
			templates[templateId] = compile(mjml.html)
		}

		const command = new SendEmailCommand({
			Destination: { ToAddresses: [to] },
			FromEmailAddress: 'Notice <noreply@notice.studio>',
			Content: {
				Simple: {
					Subject: { Data: subject },
					Body: { Html: { Data: templates[templateId](params) } },
				},
			},
			ConfigurationSetName: 'general-transactionnal',
		})

		try {
			await ses.send(command)
		} catch (ex: any) {
			Logger.error('email', ex)
		}
	}

	export const sendAuthCode = async ({ to, params }: Omit<EmailSendParams, 'templateId' | 'subject'>) => {
		if (NEnv.NODE_ENV === 'development') {
			Logger.debug('email', `Auth code: ${params.code}`)
			return
		}

		try {
			const domain = to.split('@')[1]
			const records = await dns.promises.resolveMx(domain)
			const exchanges = records.map((e) => e.exchange)

			// Check if the domain is blacklisted, if so return and send slack error
			if (Consts.BANNED_DOMAINS[domain]) {
				return
			}

			for (let exchange of exchanges) {
				if (Consts.MX_BLACK_LIST[exchange]) {
					throw new Error('Obfuscated error 1')
				}

				let ips: string[] = []
				try {
					ips = await dns.promises.resolve4(exchange)
				} catch (_) {
					throw new Error('Obfuscated error')
				}
			}
		} catch (_) {
			return
		}

		console.log('sending email')
		if (templates['auth-code'] == null) {
			const content = await readFile('./assets/emails/auth-code.mjml', 'utf-8')
			const mjml = mjml2html(content)
			templates['auth-code'] = compile(mjml.html)
		}

		const command = new SendEmailCommand({
			Destination: { ToAddresses: [to] },
			FromEmailAddress: 'Notice <noreply@notice.studio>',
			Content: {
				Simple: {
					Subject: { Data: 'Notice - Login Code' },
					Body: { Html: { Data: templates['auth-code'](params) } },
				},
			},
			ConfigurationSetName: 'auth-code',
		})

		try {
			await ses.send(command)
		} catch (ex: any) {
			Logger.error('email', ex)
		}
	}

	export const unsubscribe = async (email: string) => {
		const command = new PutSuppressedDestinationCommand({
			EmailAddress: email,
			Reason: SuppressionListReason.COMPLAINT,
		})

		await ses.send(command)
	}

	export const subscribe = async (email: string) => {
		const command = new DeleteSuppressedDestinationCommand({
			EmailAddress: email,
		})

		await ses.send(command)
	}

	export async function checkEmailDomain(email: string): Promise<boolean> {
		const domain = email.split('@')[1]

		try {
			await dns.promises.resolveMx(domain)
			return true
		} catch (e) {
			return false
		}
	}
}
