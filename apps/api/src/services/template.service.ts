import { Page, TimeoutError } from 'puppeteer-core'
import { BrowserService } from './browser.service'
import { DesignService } from './design.service'
import { ScraperService } from './scraper.service'

type TaskResult =
	| {
			success: true
			data: any
	  }
	| {
			success: false
			error: string
	  }

export namespace TemplateService {
	const isMeaningful = (p: string) => {
		if (p.length === 0) return false
		if (p.includes('©')) return false
		if (p.split(' ').length < 3) return false
		return true
	}

	export const scrapURL = async (url: string): Promise<TaskResult> => {
		let page: Page | undefined

		try {
			const page = await BrowserService.openSession(url, false)
			const extractedContent = (
				await ScraperService.getTextContentFromWebsite(
					page,
					{
						minSize: 8_000,
						querySelector: 'h1,h2,h3,h4,h5,h6,p,li',
						pathPriority: [
							new URL(url).pathname,
							'/services',
							'/products',
							'/faq',
							'/about',
							'/pricing',
							'/documentation',
							'/blog',
						],
					},
					false
				)
			).filter(isMeaningful)

			const filteredContent = [...new Set(extractedContent)].join('\n')

			await BrowserService.closeSession(page)

			const data = filteredContent.substring(0, 16_000)

			return {
				success: true,
				data: data,
			}
		} catch (err) {
			if (page) await BrowserService.closeSession(page)
			if (err instanceof TimeoutError) {
				return {
					success: false,
					error: 'domain_timeout',
				}
			} else {
				return {
					success: false,
					error: 'global_error',
				}
			}
		}
	}

	export const scrapDesign = async (domain: string): Promise<TaskResult> => {
		let page: Page | undefined

		try {
			page = await BrowserService.openSession(domain)

			const result = {
				url: page.url(),
				favicon: await DesignService.extractFavicon(page),
				titles: await DesignService.extractTitles(page),
				paragraphs: await DesignService.extractParagraphs(page),
				fonts: await DesignService.extractFonts(page),
				fontColors: await DesignService.extractFontColors(page),
				// colors: await DesignService.extractColors(page),
				colors: [],
			}

			if (result.favicon) {
				// TODO : upload favicon
			}

			await BrowserService.closeSession(page)

			return {
				success: true,
				data: result,
			}
		} catch (err) {
			if (page) await BrowserService.closeSession(page)

			if (err instanceof TimeoutError) {
				return {
					success: false,
					error: 'domain_timeout',
				}
			} else {
				return {
					success: false,
					error: 'global_error',
				}
			}
		}
	}
}
