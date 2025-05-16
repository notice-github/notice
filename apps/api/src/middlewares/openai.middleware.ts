import { OpenAI } from '@notice-app/openai'
import { Logger, Middleware } from 'typerestjs'

export namespace OpenAIMiddleware {
	export const moderate = (source: 'body' | 'query' | 'params', field: string): Middleware => {
		return async (req, reply) => {
			try {
				const value = req[source][field]
				if (value == null || typeof value !== 'string' || value.length < 2) return

				const { flagged, categories } = await OpenAI.getModerationPolicy(value)
				if (!flagged) return

				const flag = Object.keys(categories).find((key) => (categories as any)[key] === true)

				return reply.error(400, 'input_flagged', `Input flagged as ${flag}`)
			} catch (ex: any) {
				Logger.warn('openai', ex, { message: 'OpenAI moderation route prolem' })
			}
		}
	}

	export const normalize = (source: 'body' | 'query' | 'params', field: string): Middleware => {
		return async (req, reply) => {
			const value = req[source][field]
			if (value == null || typeof value !== 'string') return

			req[source][field] = value
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/[' ']+/g, ' ')
				.trim()
		}
	}
}
