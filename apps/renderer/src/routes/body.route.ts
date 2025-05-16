import { BodySchema } from '@root/schemas/body.schema'
import { ContextService } from '@root/services/context.service'
import { HTMLService } from '@root/services/html.service'
import { RenderService } from '@root/services/render.service'
import { Route } from 'typerestjs'

export namespace BodyRoute {
	export const PREFIX = '/body'

	export const get: Route<BodySchema.get> = {
		method: 'GET',
		path: '/:target',
		schema: BodySchema.get,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			let result: string
			let mimeType: string

			switch (req.query.format) {
				case 'html':
					result = HTMLService.parseAndClean(ctx, await RenderService.renderBody(ctx, 'HTML'))
					mimeType = 'text/html'
					break
				case 'markdown':
					result = await RenderService.renderBody(ctx, 'MARKDOWN')
					mimeType = 'text/markdown'
					break
				case 'fragmented':
					const spaces = await RenderService.renderBody(ctx, 'JSON')
					for (let space in spaces) {
						spaces[space] = HTMLService.parseAndClean(ctx, spaces[space])
					}
					result = JSON.stringify(spaces)
					mimeType = 'application/json'
					break
			}

			return reply.custom().header('Content-Type', mimeType).status(200).send(result)
		},
	}
}
