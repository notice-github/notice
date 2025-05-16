import { Middleware } from 'typerestjs'

export namespace APIMiddleware {
	export const autolang = (): Middleware => {
		return async (req) => {
			const lang = req.query.lang
			req.language = lang
		}
	}
}
