import { MetaSchema } from '@root/schemas/meta.schema'
import { ContextService } from '@root/services/context.service'
import { MetaService } from '@root/services/meta.service'
import { Route } from 'typerestjs'

export namespace SitemapRoute {
	export const PREFIX = '/meta'

	export const robots: Route<MetaSchema.robots> = {
		method: 'GET',
		path: '/:target/robots.txt',
		schema: MetaSchema.robots,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			const robots = await MetaService.generateRobots(ctx)

			return reply.custom().header('Content-Type', 'text/plain').status(200).send(robots)
		},
	}

	export const sitemapXML: Route<MetaSchema.sitemap> = {
		method: 'GET',
		path: '/:target/sitemap.xml',
		schema: MetaSchema.sitemap,
		handler: async (req, reply) => {
			const ctx = await ContextService.create(req, reply)
			if (!ctx) return reply.error(404, 'target_not_found', `Could not find target ${req.params.target}`)

			const sitemap = await MetaService.generateSitemap(ctx)

			return reply.custom().header('Content-Type', 'application/xml').status(200).send(sitemap)
		},
	}
}
