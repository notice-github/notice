import { MongoDB } from '@notice-app/mongodb'
import { NTime } from '@notice-app/tools'
import { createPageSummary } from '@root/components/blocks/page.block'
import { I18n } from '@root/i18n'
import { V1PageSchema } from '@root/schemas/v1/page.schema'
import { BlockService } from '@root/services/block.service'
import { ContextService } from '@root/services/context.service'
import { CustomHTMLElement } from '@root/services/html.service'
import { Handler } from 'typerestjs'

export namespace V1PageController {
	/**
	 * @GET /v1/pages/:pageId
	 */
	export const get: Handler<V1PageSchema.get> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.pageId)
		if (!base) return reply.error(404, 'page_not_found')
		if (base.type !== 'page') return reply.error(400, 'not_a_page')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		const page = await BlockService.getBlock(base, lang, MongoDB.published_blocks, false)
		if (!page) return reply.error(404, 'page_not_found')

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(200, BlockService.exportGraph(page))
	}

	/**
	 * @GET /v1/pages/:pageId/settings
	 */
	export const settings: Handler<V1PageSchema.settings> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.pageId)
		if (!base) return reply.error(404, 'page_not_found')
		if (base.type !== 'page') return reply.error(400, 'not_a_page')

		delete base.preferences?.contactFormEmail

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(200, { preferences: base.preferences, colors: base.colors, layout: base.layout })
	}

	/**
	 * @GET /v1/pages/:pageId/blocks
	 */
	export const blocks: Handler<V1PageSchema.blocks> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.pageId)
		if (!base) return reply.error(404, 'page_not_found')
		if (base.type !== 'page') return reply.error(400, 'not_a_page')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		let filter: Record<string, any> = {}
		if (req.query.type) filter['type'] = req.query.type

		let pagination: { limit: number; offset: number }
		if (req.query.limit || req.query.offset) {
			pagination = {
				limit: req.query.limit || 100,
				offset: req.query.offset || 0,
			}
		}

		const blocks = await BlockService.getBlocks(base, lang, MongoDB.published_blocks, filter, pagination)

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(
			200,
			blocks.map((block) => BlockService.exportBlock(block))
		)
	}

	/**
	 * @GET /v1/pages/:pageId/seo
	 */
	export const seo: Handler<V1PageSchema.seo> = async (req, reply) => {
		const base = await BlockService.getBlockBase(req.params.pageId)
		if (!base) return reply.error(404, 'page_not_found')
		if (base.type !== 'page') return reply.error(400, 'not_a_page')

		const lang = ContextService.language(req, base.defaultLanguage, base.availableLanguages)

		const page = await BlockService.getBlock(base, lang)
		if (!page) return reply.error(404, 'page_not_found')

		const elements: CustomHTMLElement[] = []

		// * When it will have usage of this feature I will make a service for it sync with the rest of the code

		const isArticle = base._id !== base.rootId

		const title = page.data?.text ?? I18n.getText('Untitled', lang, 'Untitled')
		const image = page.blocks.find((block) => block.type === 'image')?.data?.file?.url
		const summary = createPageSummary(page)

		// Hreflang
		const origin = req.headers.origin
		if (origin && base.availableLanguages.length > 0) {
			// Add the x-default language (unspecified generic page)
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'alternate',
					href: origin,
					hreflang: 'x-default',
				},
			})

			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'alternate',
					href: `${origin}?lang=${base.defaultLanguage}`,
					hreflang: base.defaultLanguage,
				},
			})

			base.availableLanguages.forEach((lang) => {
				elements.push({
					tagName: 'link',
					attributes: {
						rel: 'alternate',
						href: `${origin}?lang=${lang}`,
						hreflang: lang,
					},
				})
			})
		}

		// Title
		elements.push({
			tagName: 'title',
			innerText:
				base.preferences?.projectTitle === title ? title : `${base.preferences?.projectTitle || ''} - ${title}`,
		})

		// Description
		elements.push({
			tagName: 'meta',
			attributes: {
				name: 'description',
				content: summary,
			},
		})

		// Icon
		if (base.preferences?.logoUrl) {
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'icon',
					href: base.preferences.logoUrl,
				},
			})
		}

		// Open Graph
		elements.push(
			...[
				{
					tagName: 'meta',
					attributes: {
						property: 'og:title',
						content: title,
					},
				},
				{
					tagName: 'meta',
					attributes: {
						property: 'og:description',
						content: summary,
					},
				},
				{
					tagName: 'meta',
					attributes: {
						property: 'og:type',
						content: isArticle ? 'article' : 'website',
					},
				},
				{
					tagName: 'meta',
					attributes: {
						property: 'og:site_name',
						content: base.preferences?.projectTitle || title,
					},
				},
				...(isArticle
					? [
							...(page.metadata.datePublished
								? [
										{
											tagName: 'meta',
											attributes: {
												property: 'article:published_time',
												content: NTime.from(page.metadata.datePublished).toISOString(),
											},
										},
								  ]
								: []),
							...(page.metadata.author?.name
								? [
										{
											tagName: 'meta',
											attributes: {
												property: 'article:author',
												content: page.metadata.author.name,
											},
										},
								  ]
								: []),
					  ]
					: []),
				...(image
					? [
							{
								tagName: 'meta',
								attributes: {
									property: 'og:image',
									content: image,
								},
							},
					  ]
					: []),
			]
		)

		// Twitter (X)
		elements.push(
			...[
				{
					tagName: 'meta',
					attributes: {
						name: 'twitter:card',
						content: 'summary',
					},
				},
				{
					tagName: 'meta',
					attributes: {
						name: 'twitter:title',
						content: title,
					},
				},
				{
					tagName: 'meta',
					attributes: {
						name: 'twitter:description',
						content: summary,
					},
				},
				...(image
					? [
							{
								tagName: 'meta',
								attributes: {
									name: 'twitter:image',
									content: image,
								},
							},
					  ]
					: []),
			]
		)

		reply.custom().header('CDN-Tag', base.rootId)

		return reply.success(200, elements)
	}
}
