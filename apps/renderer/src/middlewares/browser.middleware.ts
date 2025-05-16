import { Middleware } from 'typerestjs'

declare module 'typerestjs' {
	interface ServerRequest {
		browserColorScheme: 'light' | 'dark'
		userColorScheme: 'light' | 'dark' | undefined
		language?: string
		integration?: string
	}
}

export namespace BrowserMiddleware {
	export const colorScheme = (): Middleware => {
		return async (req, reply) => {
			// Request headers from the browser
			// req.browserColorScheme = req.headers['sec-ch-prefers-color-scheme'] === 'dark' ? 'dark' : 'light'

			switch (req.query.theme) {
				case 'dark':
					req.userColorScheme = 'dark'
					break
				case 'light':
					req.userColorScheme = 'light'
					break
				default:
					req.userColorScheme = undefined
			}

			// Response headers for the browser (works only for Chromium browsers)
			// reply.custom().header('Accept-CH', 'Sec-CH-Prefers-Color-Scheme')
			// reply.custom().header('Vary', 'Sec-CH-Prefers-Color-Scheme')
			// reply.custom().header('Critical-CH', 'Sec-CH-Prefers-Color-Scheme')
		}
	}

	export const language = (): Middleware => {
		return async (req, reply) => {
			const lang = req.query.lang
			req.language = lang
		}
	}

	export const integration = (): Middleware => {
		return async (req, reply) => {
			req.integration = req.query.integration || undefined
		}
	}
}
