import { DocumentSchema } from '@root/schemas/document.schema'
import { BlockService } from '@root/services/block.service'
import { ContextService } from '@root/services/context.service'
import { HTMLService } from '@root/services/html.service'
import { RenderService } from '@root/services/render.service'
import { Route } from 'typerestjs'

export namespace DocumentRoute {
	export const PREFIX = '/document'

	export const get: Route<DocumentSchema.get> = {
		method: 'GET',
		path: '/:target',
		schema: DocumentSchema.get,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			let result: string
			let mimeType: string

			switch (req.query.format) {
				case 'html':
					ctx.navigationType = 'slash'
					result = await RenderService.renderHTMLDocument(ctx)
					mimeType = 'text/html'
					break
				case 'markdown':
					result = await RenderService.renderMarkdownDocument(ctx)
					mimeType = 'text/markdown'
					break
				case 'fragmented': {
					const [head, meta, style, script, body] = await Promise.all([
						RenderService.renderHead(ctx, 'JSON'),
						RenderService.renderMetadata(ctx, 'JSON'),
						RenderService.renderStyles(ctx, 'HTML'),
						RenderService.renderScripts(ctx, 'HTML'),
						RenderService.renderBody(ctx, 'HTML'),
					])

					result = JSON.stringify({
						id: ctx.rootBlock._id,
						head,
						meta,
						style,
						script,
						body: HTMLService.parseAndClean(ctx, body),
					})
					mimeType = 'application/json'
					break
				}
				case 'article-md': {
					const [meta, body] = await Promise.all([
						RenderService.renderMetadata(ctx, 'JSON'),
						RenderService.renderBody(ctx, 'MARKDOWN'),
					])

					result = JSON.stringify({
						id: ctx.rootBlock._id,
						head: meta,
						title: ctx.block.data?.text,
						description:
							typeof meta !== 'string'
								? meta.find((m) => m.attributes?.name === 'description')?.attributes?.content
								: undefined,
						cover: ctx.block.data?.cover,
						metadata: ctx.block.metadata,
						content: body.replace(/^#.+\n/, ''),
					})
					mimeType = 'application/json'

					break
				}
				case 'article-json': {
					const meta = RenderService.renderMetadata(ctx, 'JSON')

					result = JSON.stringify({
						id: ctx.rootBlock._id,
						head: meta,
						title: ctx.block.data?.text,
						description:
							typeof meta !== 'string'
								? meta.find((m) => m.attributes?.name === 'description')?.attributes?.content
								: undefined,
						cover: ctx.block.data?.cover,
						metadata: ctx.block.metadata,
						content: ctx.block.blocks.map((block) => BlockService.exportBlock(block)),
					})
					mimeType = 'application/json'

					break
				}
			}

			return reply.custom().header('Content-Type', mimeType).status(200).send(result)
		},
	}
}
