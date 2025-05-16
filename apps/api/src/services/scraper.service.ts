import { Page } from 'puppeteer-core'
import { BrowserService } from './browser.service'

interface CrawlerSettings {
	pathPriority?: string[]
	minSize: number
	querySelector: string
	mataDescription?: boolean
	title?: boolean
}

export namespace ScraperService {
	const sortDepth = (a: string, b: string) => {
		return a.split('/').filter((e) => e).length - b.split('/').filter((e) => e).length
	}

	const getLinksPaths = async (page: Page, isDomain = true) => {
		const origin = new URL(page.url()).origin
		const start = isDomain ? origin : new URL(page.url()).href
		const links = await page.$$eval('a', (links) => links.map((link) => link.href))

		links.unshift(start)
		const internalPaths = links.filter((url) => url.startsWith(origin)).map((url) => new URL(url).pathname)

		return [...new Set(internalPaths)]
	}

	export const orderByPathImportance = (scrapedPaths: string[], pathsPriority?: string[]) => {
		let paths = scrapedPaths
			.map((e: string) => {
				return e[e.length - 1] === '/' ? e : e + '/'
			})
			.sort(sortDepth)
		paths = [...new Set(paths)]
		const prioritizedPaths = pathsPriority ?? ['/']
		let cleanedPaths: string[] = []

		for (const path of prioritizedPaths) {
			const pathIncluded = paths.filter((x) => x.match(path))
			const orderedPaths = pathIncluded.sort(sortDepth)
			paths = paths.filter((e) => !orderedPaths.includes(e))
			cleanedPaths = cleanedPaths.concat(orderedPaths)
		}

		cleanedPaths.push(...paths)
		return cleanedPaths
	}

	export const getTextContentFromWebPage = async (
		page: Page,
		querySelector: string,
		metaDescription = true,
		title = true
	) => {
		const pageContent = await page.$$eval(querySelector, (content) => {
			return (content as HTMLElement[]).map((node) => node.innerText?.trim() ?? '')
		})

		if (metaDescription) {
			const description = await page.evaluate(() => {
				return document.querySelector("head > meta[name='description']")?.getAttribute('content') ?? ''
			})
			pageContent.unshift(description)
		}
		if (title) {
			pageContent.unshift(await page.title())
		}
		return pageContent
	}

	export const getTextContentFromWebsite = async (page: Page, settings: CrawlerSettings, isDomain = true) => {
		settings.title ??= true
		settings.mataDescription ??= true

		let content: string[] = []

		const paths = orderByPathImportance(await getLinksPaths(page, isDomain), settings.pathPriority)
		const origin = new URL(page.url()).origin

		for (const path of paths) {
			if (content.reduce((acc, val) => acc + val.length, 0) > settings.minSize) break
			await BrowserService.navigate(page, `${origin}${path}`)
			content.push(
				...(await getTextContentFromWebPage(page, settings.querySelector, settings.mataDescription, settings.title))
			)
		}
		return content
	}
}
