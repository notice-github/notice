import { extractColorsFromImageData as colorsOf } from 'extract-colors'
import { unlink } from 'fs/promises'
import Jimp from 'jimp'
import { Page } from 'puppeteer-core'
import { BrowserService } from './browser.service'

export namespace DesignService {
	const frequencyOf = <T>(elements: T[]) => {
		const uniques = [...new Set(elements)]

		return uniques.map((uniq) => {
			const numberOfOccurence = elements.filter((el) => el === uniq).length

			return {
				value: uniq,
				frequency: Math.round((numberOfOccurence / elements.length) * 100) / 100,
			}
		})
	}

	const rgbToHex = (color: string) => {
		if (!color.startsWith('rgb')) return null

		const colors = color.match(/[0-9]{1,3}/g)
		if (!colors) return null

		const [red, green, blue] = colors.slice(0, 3).map((int) => parseInt(int).toString(16).padStart(2, '0'))

		return `#${red}${green}${blue}`
	}

	export const extractFavicon = async (page: Page) => {
		const href = await page.evaluate(() => {
			const favicon = document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')
			const icon = document.querySelector('link[rel*="icon"]')?.getAttribute('href')

			return favicon ?? icon ?? undefined
		})
		if (!href) return null

		try {
			return new URL(href, page.url()).href
		} catch (_) {
			return null
		}
	}

	export const extractParagraphs = async (page: Page) => {
		const paragraphs = await page.$$eval('p,span', (paragraphs) => {
			const isMeaningful = (p: string) => {
				if (p.length === 0) return false
				if (p.includes('©')) return false
				if (p.split(' ').length < 4) return false
				return true
			}

			return paragraphs
				.map((p) => p.textContent?.trim() ?? '')
				.filter(isMeaningful)
				.slice(0, 50)
		})

		return [...new Set(paragraphs)]
	}

	export const extractTitles = async (page: Page) => {
		const titles = await page.$$eval('h1,h2,h3', (headers) =>
			headers
				.map((h) => ({ level: h.nodeName as 'page' | 'H1' | 'H2' | 'H3', content: h.textContent?.trim() ?? '' }))
				.filter((title) => title.content.length > 0)
				.slice(0, 25)
		)

		titles.unshift({ level: 'page', content: await page.title() })

		return [...new Set(titles)]
	}

	export const extractFonts = async (page: Page) => {
		const fonts = await page.$$eval('*', (elements) => {
			const isTextElement = (el: Element) => {
				const children = [...el.childNodes.values()]
				return children.length > 0 && children.every((n) => n.nodeName === '#text')
			}

			return elements
				.filter(isTextElement)
				.map((el) => getComputedStyle(el).fontFamily)
				.map((font) => font.split(',')[0]) // ex: Arial, -apple-system, sans-serif => Arial
				.map((font) => font.replace(/\"/g, '')) // ex: "Times New Roman" => Times New Roman
				.filter((font) => font.length > 0)
		})

		const fontsFrequency = frequencyOf(fonts)

		return fontsFrequency
			.map((font) => ({ font: font.value, importance: font.frequency }))
			.filter(({ importance }) => importance > 0)
			.sort((a, b) => b.importance - a.importance)
	}

	export const extractFontColors = async (page: Page) => {
		const fontColors = await page.$$eval('*', (elements) =>
			elements.map((el) => getComputedStyle(el).color).filter((c) => c.startsWith('rgb') || c.startsWith('#'))
		)

		const fontColorsFrequency = frequencyOf(fontColors)

		return fontColorsFrequency
			.map((fc) => ({ color: rgbToHex(fc.value) ?? fc.value, importance: fc.frequency }))
			.filter(({ importance }) => importance > 0)
			.sort((a, b) => b.importance - a.importance)
	}

	export const extractColors = async (page: Page) => {
		const screenshot = await BrowserService.screenshot(page, { fullPage: true })

		const image = await Jimp.read(screenshot)

		const colors = colorsOf({
			data: Uint8ClampedArray.from(image.bitmap.data),
			width: image.bitmap.width,
			height: image.bitmap.height,
		})

		await unlink(screenshot)

		return colors
			.map((color) => ({ color: color.hex, importance: Math.round(color.area * 100) / 100 }))
			.filter(({ importance }) => importance > 0)
			.sort((a, b) => b.importance - a.importance)
	}
}
