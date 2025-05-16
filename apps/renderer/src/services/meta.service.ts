import { js2xml } from 'xml-js'
import { ContextService } from './context.service'

export namespace MetaService {
	export const generateRobots = async (ctx: ContextService.Context) => {
		return `User-agent: *
Allow: /

Sitemap: https://${ctx.host}/sitemap.xml`
	}

	export const generateSitemap = async (ctx: ContextService.Context) => {
		const sitemap = {
			declaration: {
				attributes: {
					version: '1.0',
					encoding: 'UTF-8',
				},
			},
			elements: [
				{
					type: 'element',
					name: 'urlset',
					attributes: {
						xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
					},
					elements: ctx.pages
						.map((page) => {
							const url = `https://${ctx.host}/${page.metadata?.slug ?? page._id}`
							return {
								type: 'element',
								name: 'url',
								elements: [
									{
										type: 'element',
										name: 'loc',
										elements: [{ type: 'text', text: url }],
									},
								],
							}
						})
						// concat the page of the root block with the previous list
						.concat([
							{
								type: 'element',
								name: 'url',
								elements: [
									{
										type: 'element',
										name: 'loc',
										elements: [{ type: 'text', text: `https://${ctx.host}` }],
									},
								],
							},
						]),
				},
			],
		}

		return js2xml(sitemap)
	}
}
