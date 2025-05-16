import { Route } from 'typerestjs'

export namespace HealthRoute {
	export const _health: Route = {
		method: 'GET',
		path: '/_health',
		handler: async (req, reply) => {
			return reply.custom().status(200).send('OK')
		},
	}
}
