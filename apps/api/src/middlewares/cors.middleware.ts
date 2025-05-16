import { Middleware } from 'typerestjs'

export namespace CorsMiddleware {
	export const fromEverywhere = (): Middleware => {
		return async (_, reply) => {
			reply.custom().header('Access-Control-Allow-Origin', '*')
			reply.custom().removeHeader('Access-Control-Allow-Credentials')
		}
	}
}
