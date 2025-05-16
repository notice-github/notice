import { BMSBlockModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { I18n } from '@root/i18n'
import { rtlList } from '@root/i18n/rtl-list'
import { ServerReply, ServerRequest } from 'typerestjs'
import { BlockService } from './block.service'
import { LayoutService } from './layout.service'

export namespace ContextService {
	export type Context = NonNullable<Awaited<ReturnType<typeof create>>>

	export const create = async (req: ServerRequest, reply: ServerReply) => {
		const mode: 'draft' | 'public' = req.query.mode ?? 'public'
		const collection = mode === 'draft' ? MongoDB.blocks : MongoDB.published_blocks

		const base = await BlockService.getBlockBase(req.query.page ?? req.params.target, collection)
		if (!base) return null

		const lang = language(req, base.defaultLanguage, base.availableLanguages)

		const [block, { slugMapping, blocksMap, ...pageTree }] = await Promise.all([
			BlockService.getBlock(base, lang, collection),
			BlockService.getPageTree(base, lang, collection),
		])

		if (!block || !pageTree) return null

		// Extract the rootBlock from pageTree because the first block of the pageTree is always the rootBlock
		// (`blocks` is a side effect of the spread syntax and should not be used!)
		const { blocks, ...rootBlock } = pageTree

		const layout = LayoutService.mergeWithDefaults(rootBlock.layout ?? {})

		// Used to purge CDN cache
		reply.custom().header('CDN-Tag', rootBlock._id)

		return {
			block,
			pageTree,
			pages: Array.from(blocksMap.values()).filter((block) => block.type === 'page'),
			slugs: slugMapping,
			rootBlock,
			lang,
			isRtl: rtlList[lang]?.isRtl ?? false,
			layout,
			layoutMode: (req.query.layout ?? 'full') as 'empty' | 'page' | 'full',
			mode,
			dictionary: I18n.getDictionary(lang),
			textOf: (key: I18n.WordKey, defaultValue: string) => I18n.getText(key, lang, defaultValue),
			theme: theme(req, rootBlock),
			customColors: customColors(req),
			isExporting: false,
			navigationType: req.query.navigationType ?? rootBlock.preferences?.navigationType ?? 'query',
			host: host(req, rootBlock),
			integration: req.integration,
		}
	}

	export const theme = (req: ServerRequest, rootBlock: BMSBlockModel.block): 'dark' | 'light' => {
		const { autoDetectDarkMode = false, defaultToDarkMode = false } = rootBlock.preferences ?? {}

		if (req.userColorScheme != undefined) return req.userColorScheme
		if (defaultToDarkMode === true) return 'dark'
		if (autoDetectDarkMode === true && req.browserColorScheme === 'dark') return 'dark'

		return 'light'
	}

	export const language = (req: ServerRequest, defaultLanguage: string, availableLanguages: string[]) => {
		if (req.language != undefined && availableLanguages.includes(req.language)) return req.language as I18n.LanguageCode
		else if (defaultLanguage != undefined) return defaultLanguage as I18n.LanguageCode
		else return 'en'
	}

	export const host = (req: ServerRequest, block: BMSBlockModel.block): string => {
		// 1. Origin: ...
		if (req.headers['origin']) {
			try {
				const url = new URL(req.headers['origin'])
				const host = url.host

				if (!['bdn.notice.studio', 'gollum.notice.studio'].includes(host)) return host
			} catch (_) {}
		}

		// 2. preferences.customDomain
		if (block.preferences?.customDomain) return block.preferences.customDomain

		// 3. preferences.domain
		if (block.preferences?.domain) return block.preferences.domain + '.notice.site'

		// 4. metadata.slug
		if (block.metadata?.slug) return block.metadata.slug + '.notice.site'

		// default: blockId
		return block._id + '.notice.site'
	}

	export const customColors = (req: ServerRequest) => {
		const vars: Record<string, any> = {}

		if (req.query.background != undefined && typeof req.query.background === 'string') {
			vars['mainBgColor'] = req.query.background
		}

		return vars
	}
}
