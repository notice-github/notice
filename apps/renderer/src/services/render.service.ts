import { NUrls } from '@notice-app/tools'
import { BLOCKS } from '@root/components/blocks'
import { createPageSummary } from '@root/components/blocks/page.block'
import { LEAVES } from '@root/components/leaves'
import { MODULES } from '@root/components/modules'
import { SPACES } from '@root/components/spaces'
import { RenderComponent, RenderFunctions, css, html } from '@root/system'
import * as cheerio from 'cheerio'
import { minify as minifyCSS } from 'csso'
import esbuild from 'esbuild'
import postcss from 'postcss'
import prefixer from 'postcss-prefixer'
import { ELEMENTS } from '../components/elements'
import { Helpers } from '../tools/helpers.tool'
import { ContextService } from './context.service'
import { CustomHTMLElement, HTMLService } from './html.service'
import { ScriptService } from './script.service'
import { StyleService } from './style.service'

export namespace RenderService {
	export type Format = 'HTML' | 'MARKDOWN' | 'JSON'

	export const renderBlocks = (ctx: ContextService.Context, format: Format = 'HTML') => {
		return ctx.block.blocks
			.map((block) => renderBlock({ ...ctx, block }, format))
			.join(format === 'MARKDOWN' ? '\n' : '')
	}

	export const renderBlock = (ctx: ContextService.Context, format: Format = 'HTML'): string => {
		const component = BLOCKS[ctx.block.type]
		if (!component) return ''

		let renderFunction: RenderFunctions['block'] | undefined
		if (format === 'MARKDOWN' && 'MARKDOWN' in component) renderFunction = component['MARKDOWN']
		else if (format === 'HTML' && 'HTML' in component) renderFunction = component['HTML']

		if (!renderFunction) return ''
		else return renderFunction(ctx)
	}

	export const renderLeaves = (ctx: ContextService.Context, format: Format = 'HTML') => {
		return ctx.block.data.leaves
			.map((leaf: any) => {
				let { text, ...attrs } = leaf

				text ??= ''
				if (format === 'HTML') text = HTMLService.escape(text)?.replace?.(/\n/g, '<br />') ?? ''

				if (attrs.code) return LEAVES['code'][format](text)

				return Object.keys(attrs).reduce((text, attr) => {
					const component = LEAVES[attr as keyof LEAVES]
					if (!component) return text

					let renderFunction: RenderFunctions['leaf'] | undefined
					if (format === 'MARKDOWN' && 'MARKDOWN' in component) renderFunction = component['MARKDOWN']
					else if (format === 'HTML' && 'HTML' in component) renderFunction = component['HTML']

					if (!renderFunction) return text
					else return renderFunction(text, attrs[attr])
				}, text)
			})
			.join('')
	}

	export const renderHead = async (ctx: ContextService.Context, format: Format = 'HTML') => {
		const { handlePageTitle, handleFavicon, logoUrl, fontFamilyName = 'system-ui' } = ctx.rootBlock.preferences ?? {}

		const userHead = ctx.rootBlock.userCode?.HEAD ?? ''

		const elements: CustomHTMLElement[] = []

		if (handleFavicon && logoUrl) {
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'icon',
					href: logoUrl,
				},
			})
		}

		if (handlePageTitle) {
			elements.push({
				tagName: 'title',
				innerText: ctx.block?.data?.text || 'Notice',
			})
		}

		if (fontFamilyName != null && fontFamilyName !== 'system-ui') {
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'stylesheet',
					href: `https://fonts.googleapis.com/css?family=${fontFamilyName.replace(/ /g, '+')}:300,400,500,600,700`,
				},
			})
		}

		// If we have translations, we add the alternate links
		// See https://developers.google.com/search/docs/specialty/international/localized-versions
		if (ctx.rootBlock.preferences?.availableLanguages) {
			const subpage = ctx.block._id !== ctx.rootBlock._id ? `/${ctx.block.metadata?.slug ?? ctx.block._id}` : ''

			const defaultLanguage = ctx.rootBlock.preferences?.defaultLanguage

			// Add the x-default language (unspecified generic page)
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'alternate',
					href: `https://${ctx.host}${subpage}`,
					hreflang: 'x-default',
				},
			})

			// Add the default language in the alternate links
			elements.push({
				tagName: 'link',
				attributes: {
					rel: 'alternate',
					href: `https://${ctx.host}${subpage}?lang=${defaultLanguage}`,
					hreflang: defaultLanguage,
				},
			})

			// Add the 'other' languages
			ctx.rootBlock.preferences?.availableLanguages.forEach((lang) => {
				elements.push({
					tagName: 'link',
					attributes: {
						rel: 'alternate',
						href: `https://${ctx.host}${subpage}?lang=${lang}`,
						hreflang: lang,
					},
				})
			})
		}

		elements.push(
			...[
				{
					tagName: 'link',
					attributes: {
						rel: 'stylesheet',
						href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css',
					},
				},
				{
					tagName: 'script',
					attributes: {
						type: 'text/javascript',
						src: 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js',
						defer: true,
					},
				},
			]
		)

		if (userHead) {
			try {
				const $ = cheerio.load(html`
					<!doctype html>
					<html lang="en">
						<head>
							${userHead}
						</head>
						<body></body>
					</html>
				`)

				$('head *').each(function (_, el) {
					const innerHTML = $(this).html().trim()

					elements.push({
						tagName: el.tagName.toLowerCase(),
						attributes: el.attribs,
						...(innerHTML ? { innerHTML } : {}),
					})
				})
			} catch (_) {}
		}

		switch (format) {
			case 'JSON':
				return elements
			case 'HTML':
				return elements.map((elem) => HTMLService.elementToHTML(elem)).join('\n')
			default:
				throw new Error(`Unsupported format: ${format}`)
		}
	}

	const MODES = {
		empty: ['content'],
		page: ['top', 'content', 'right', 'bottom'],
		full: ['header', 'left', 'top', 'content', 'bottom', 'right'],
	}

	export async function renderBody(ctx: ContextService.Context, format: 'HTML' | 'MARKDOWN'): Promise<string>
	export async function renderBody(ctx: ContextService.Context, format: 'JSON'): Promise<Record<string, string>>
	export async function renderBody(ctx: ContextService.Context, format: Format = 'HTML') {
		switch (format) {
			case 'HTML': {
				// prettier-ignore
				return html`
					<div id="${ctx.rootBlock._id}" class="wrapper">
						${renderSpace('header', ctx)}
						${renderSpace('left', ctx)}
						${renderSpace('top', ctx)}
						${renderSpace('content', ctx)}
						${renderSpace('bottom', ctx)}
						${renderSpace('right', ctx)}
						${ELEMENTS['created_with_notice_text'].HTML(ctx)}
					</div>
				`
			}
			case 'MARKDOWN': {
				// Creates the page title
				const markdown = `# ${ctx.block?.data?.text ?? ctx.textOf('Untitled', 'Untitled')}\n`
				// Render all the blocks in markdown
				return markdown + renderBlocks(ctx, 'MARKDOWN')
			}
			case 'JSON': {
				return Object.fromEntries(
					(['top', 'content', 'bottom', 'right'] as const)
						.filter((space) => {
							if (space === 'content') return true
							else return ctx.layout[`${space}_space`].show && MODES[ctx.layoutMode].includes(space)
						})
						.map((space) => [space, RenderService.renderSpace(space, ctx)])
				)
			}
		}
	}

	export const renderSpace = (space: keyof SPACES | 'content', ctx: ContextService.Context) => {
		if (space === 'content') {
			const pageHasImage = Helpers.hasImage(ctx.block)
			const renderLightBoxModule = RenderService.renderHTMLIf(ctx, MODULES['lightbox'], pageHasImage)

			return html`<div class="space-content">${renderBlocks(ctx)} ${renderLightBoxModule}</div>`
		}
		if (ctx.layout[`${String(space)}_space`].show && MODES[ctx.layoutMode].includes(space)) {
			return SPACES[space].HTML(ctx)
		}
		return ''
	}

	export const renderStyles = async (ctx: ContextService.Context, format: Format = 'HTML') => {
		let styles = css`
			.wrapper[id='${ctx.rootBlock._id}'] {
				${StyleService.userCSSVars(ctx)}
			}

			.wrapper {
				${StyleService.appCSSVars()}
			}

			${StyleService.globalStyles()}
			${StyleService.blocksStyles()}
			${StyleService.leavesStyles()}
			${StyleService.spacesStyles()}
			${StyleService.elementsStyles()}
			${StyleService.modulesStyles()}
		`

		styles = (
			await postcss([
				// Prefix all classes with .NTC_
				prefixer({
					prefix: 'NTC_',
					ignore: [/(#[a-zA-Z_\-0-9]+)|(\[.+\])/],
				}),
			]).process(styles, { from: 'index.css' })
		).css

		// This is inserted at the end to:
		//  - avoid 500 errors if the user CSS is invalid
		//  - not be prefixed by _NTC
		//  - be able to override any other CSS (not sure it applies)
		styles += StyleService.userCustomCSS(ctx)

		return minifyCSS(styles).css
	}

	export const renderScripts = async (ctx: ContextService.Context, format: Format = 'HTML') => {
		const functions = [
			...Object.values(ScriptService.globalScripts),
			...ScriptService.blocksScripts(),
			...ScriptService.spacesScripts(),
			...ScriptService.modulesScripts(),
			...ScriptService.elementsScripts(),
		]

		const code = functions
			.map((func) => func.toString().replace(/([a-z0-9_]+\.)?\$NTC/g, `\$NTC['${ctx.rootBlock._id}']`))
			.join(', \n')

		// const visitEventCode = `
		// 	setTimeout(() => {
		// 		fetch('${NUrls.App.lighthouse()}/visits/${ctx.rootBlock._id}', {
		// 			method: 'POST',
		// 			headers: { 'Content-Type': 'application/json' },
		// 			body: JSON.stringify({
		// 				url: location.href,
		// 				integration: $NTC['${ctx.rootBlock._id}'].integration || undefined,
		// 			}),
		// 		})
		// 	}, 500)
		// `

		let script = `
			if (window.$NTC == null || typeof window.$NTC !== 'object' || Array.isArray(window.$NTC)) window.$NTC = {}

			if (window.$NTC.onReady == undefined) {
				window.$NTC.onReady = function (id, callback, loop = 0) {
					if (loop > 100 /* 10s */) return

					if (document.querySelector('.NTC_wrapper[id="' + id + '"]')) {
						callback()
					} else {
						setTimeout(() => window.$NTC.onReady(id, callback, loop++), 100)
					}
				}
			}

			window.$NTC.onReady('${ctx.rootBlock._id}', function () {
				window.$NTC['${ctx.rootBlock._id}'] = {
					wrapper: document.querySelector('.NTC_wrapper[id="${ctx.rootBlock._id}"]'),
					blockId: "${ctx.block._id}",
					rootId: "${ctx.rootBlock._id}",
					serverURL: "${NUrls.App.bdn()}",
					lighthouseURL: "${NUrls.App.lighthouse()}",
					navigationType: "${ctx.navigationType}",
					theme: "${ctx.theme}",
					lang: "${ctx.lang}",
					slugs: ${JSON.stringify(Object.fromEntries(ctx.slugs))},
					integration: ${ctx.integration ? `"${ctx.integration}"` : 'undefined'},
					${code},
				}

				window.$NTC['${ctx.rootBlock._id}'].defineBaseURL()
				window.$NTC['${ctx.rootBlock._id}'].loadOnHistoryChanges()
				window.$NTC['${ctx.rootBlock._id}'].injectDynamicVars()
				setTimeout(() => window.$NTC['${ctx.rootBlock._id}'].navigateToAnchor(), 100)


				${ScriptService.userScripts(ctx)}
			})
		`

		try {
			const minifiedScript = (await esbuild.transform(script, { minify: true })).code
			script = minifiedScript
		} catch (_) {}

		return script
	}

	export const renderMetadata = (ctx: ContextService.Context, format: Format = 'HTML') => {
		if (!ctx.block?.blocks?.length) return ''

		const { projectTitle } = ctx.rootBlock.preferences ?? {}

		const title = ctx.block.data?.text ?? projectTitle ?? ctx.textOf('Untitled', 'Untitled')
		const image = ctx.block.blocks.find((block) => block.type === 'image')?.data?.file?.url
		const summary = HTMLService.unescape(createPageSummary(ctx.block))

		const elements: CustomHTMLElement[] = []

		elements.push({
			tagName: 'meta',
			attributes: {
				name: 'description',
				content: summary,
			},
		})

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
						content: 'website',
					},
				},
			]
		)
		if (image) {
			elements.push({
				tagName: 'meta',
				attributes: {
					property: 'og:image',
					content: image,
				},
			})
		}
		if (projectTitle) {
			elements.push({
				tagName: 'meta',
				attributes: {
					property: 'og:site_name',
					content: projectTitle,
				},
			})
		}

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
			]
		)
		if (image) {
			elements.push({
				tagName: 'meta',
				attributes: {
					name: 'twitter:image',
					content: image,
				},
			})
		}

		// If the page is not the rootBlock, we add the "Article" schema JSON-LD
		// We do that because, usually, rootBlock is a single page project (rarely an article)
		// or rootBlock is the "welcome page" of a blog / doc
		// These schemas are REALLY great for SEO. They can give you lots of visibility in Google
		// rich snippets, getting featured in news, etc.
		if (ctx.block._id !== ctx.rootBlock._id) {
			const logoUrl = ctx.rootBlock.preferences?.logoUrl
			const slug = ctx.block.metadata?.slug ?? ctx.block._id
			const { datePublished = '', dateModified = '', author } = ctx.block.metadata
			const url = `https://${ctx.host}/${slug}`

			// documentation: https://schema.org/Article
			// validator: https://validator.schema.org/
			const jsonld = {
				'@context': 'https://schema.org',
				'@type': 'Article',
				url,
				name: ctx.block.data?.text,
				headline: ctx.block.data?.text,
				description: summary,
				inLanguage: ctx.lang,
				mainEntityOfPage: url,
				image: image ?? '',
				publisher: {
					'@type': 'Organization',
					name: ctx.rootBlock.preferences?.projectTitle ?? '',
					logo: logoUrl ? { '@type': 'ImageObject', url: logoUrl } : undefined,
				},
				// We default to the date where the feature has been published
				// For future articles, they shall have a default one when created
				datePublished: datePublished ?? '2024-01-16',
				dateModified: dateModified ?? '2024-01-16',
			}

			if (author) {
				jsonld['author'] = {
					'@type': 'Person',
					name: author.name,
				}
			}
			elements.push({
				tagName: 'script',
				attributes: {
					type: 'application/ld+json',
				},
				innerHTML: JSON.stringify(jsonld),
			})
		}

		switch (format) {
			case 'JSON':
				return elements
			case 'HTML':
				return elements.map((elem) => HTMLService.elementToHTML(elem)).join('\n')
			default:
				throw new Error(`Unsupported format: ${format}`)
		}
	}

	//----------------//
	// HTML Functions //
	//----------------//

	export const renderHTMLDocument = async (ctx: ContextService.Context) => {
		const [meta, head, styles, scripts, body] = await Promise.all([
			renderMetadata(ctx, 'HTML'),
			renderHead(ctx, 'HTML'),
			renderStyles(ctx, 'HTML'),
			renderScripts(ctx, 'HTML'),
			renderBody(ctx, 'HTML'),
		])

		// prettier-ignore
		return HTMLService.parseAndClean(ctx, html`
			<!doctype html>
			<html lang="${ctx.lang}">
				<head>
					${meta}
					${head}
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta charset="utf-8" />
					<style id="NTC_style-document">
						html, body {
							height: 100%;
							margin: 0;
							padding: 0;
							overflow: auto;
						}

						.NTC_wrapper {
							min-height: 100vh;
						}
					</style>
					<style id="NTC_style-${ctx.rootBlock._id}">
						${styles}
					</style>
					<script nonce="noticenonce" id="NTC_script-${ctx.rootBlock._id}">
						${scripts}
					</script>
				</head>
				<body>
					${body}
				</body>
			</html>
		`, true)
	}

	export const renderMarkdownDocument = async (ctx: ContextService.Context) => {
		// Creates the page title
		const markdown = `# ${ctx.block?.data?.text}\n`
		// Render all the blocks in markdown
		return markdown + renderBlocks(ctx, 'MARKDOWN')
	}

	export const renderHTMLIf = <T extends 'element'>(
		ctx: ContextService.Context,
		component: RenderComponent<T>,
		condition: boolean
	) => {
		if (condition === true) return component.HTML(ctx)
		return ''
	}
}
