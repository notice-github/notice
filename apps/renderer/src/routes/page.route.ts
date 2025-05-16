import { PageSchema } from '@root/schemas/page.schema'
import { ContextService } from '@root/services/context.service'
import { HTMLService } from '@root/services/html.service'
import { RenderService } from '@root/services/render.service'
import { Route } from 'typerestjs'

export namespace PageRoute {
	export const PREFIX = '/pages'

	export const full: Route<PageSchema.full> = {
		method: 'GET',
		path: '/:target/full',
		schema: PageSchema.full,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			const [head, styles, scripts, body] = await Promise.all([
				RenderService.renderHead(ctx, 'HTML'),
				RenderService.renderStyles(ctx, 'HTML'),
				RenderService.renderScripts(ctx, 'HTML'),
				RenderService.renderBody(ctx, 'HTML'),
			])

			const result = {
				rootId: ctx.rootBlock._id,
				head,
				styles,
				scripts,
				body: HTMLService.parseAndClean(ctx, body),
			}

			return reply.custom().status(200).header('Content-Type', 'application/json').send(JSON.stringify(result))
		},
	}

	export const update: Route<PageSchema.update> = {
		method: 'GET',
		path: '/:target/update',
		schema: PageSchema.update,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			const result = Object.fromEntries(
				(['top', 'content', 'bottom', 'right'] as const)
					.filter((space) => space === 'content' || ctx.layout[`${space}_space`].show)
					.map((space) => [space, HTMLService.parseAndClean(ctx, RenderService.renderSpace(space, ctx))])
			)

			return reply.custom().status(200).header('Content-Type', 'application/json').send(JSON.stringify(result))
		},
	}
}
