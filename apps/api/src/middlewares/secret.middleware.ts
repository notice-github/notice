import { Middleware } from 'typerestjs'

export namespace SecretMiddleware {
	export const secretFromQuery = (field: string = 'secret'): Middleware<any> => {
		return async (req, reply) => {
			if (req.query[field] === process.env.API_SECRET) return
			return reply.custom().status(401).send()
		}
	}

	export const secretFromBody = (field: string = 'secret'): Middleware<any> => {
		return async (req, reply) => {
			if (req.body[field] === process.env.API_SECRET) return
			return reply.custom().status(401).send()
		}
	}
}
