import * as cheerio from 'cheerio'
import { ContextService } from './context.service'

export interface CustomHTMLElement {
	tagName: string
	attributes?: Record<string, string | boolean>
	innerText?: string
	innerHTML?: string
}

export namespace HTMLService {
	/**
	 * Escapes special characters in the provided HTML string using HTML entities.
	 *
	 * @param html - The string that needs escaping
	 * @returns The input string with all special characters replaced by their corresponding HTML entities
	 */
	export const escape = (html: string) => {
		if (!html) return ''

		const esca: { [key: string]: string } = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;',
		}

		return html.replace(/[&<>'"]/g, (m: string) => esca[m])
	}

	/**
	 * Unescapes HTML special characters from the provided string.
	 *
	 * @param html - The string that needs unescaping
	 * @returns The input string with all HTML entities replaced by their corresponding characters
	 */
	export const unescape = (text: string) => {
		if (!text) return ''

		const esca: { [key: string]: string } = {
			'&amp;': '&',
			'&lt;': '<',
			'&gt;': '>',
			'&#39;': "'",
			'&quot;': '"',
		}

		return text.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, (m: string) => esca[m])
	}

	// W3C HTML Validator is here for more options/tracking: https://validator.w3.org/
	export const isValidHTML = async (html: string) => {
		return true
	}

	export const parseAndClean = (ctx: ContextService.Context, html: string, fullpage = false) => {
		// Similar to web browser contexts, load will introduce <html>, <head>,
		// and <body> elements if they are not already present.
		// You can set load's third argument to false to disable this.
		const $ = cheerio.load(html, null, fullpage)

		$('*').attr('class', function (_, value) {
			if (!value) return null

			const prefix = this.attribs['class-prefix'] ?? 'NTC_'
			if (prefix === 'none') return value

			return value
				.split(/\s+/g)
				.map((clasx) => `${prefix}${clasx}`)
				.join(' ')
		})

		$('*[class-prefix]').attr('class-prefix', null)

		const replacer = (value: string) =>
			value.replace(/^(\s*\(\s*\)\s*=>\s*)?([a-z0-9_]+\.)?\$NTC/g, `\$NTC['${ctx.rootBlock._id}']`)

		$('*[onclick]').attr('onclick', (_, value) => replacer(value))

		return $.html().replace(/\t/g, '')
	}

	const SELF_CLOSING_ELEMENTS = ['link', 'meta']
	export const elementToHTML = (element: CustomHTMLElement) => {
		let tag = `<${element.tagName} `

		if (element.attributes) {
			tag += Object.entries(element.attributes)
				.map(([key, value]) => (typeof value === 'boolean' ? `${key}` : `${key}="${value}"`))
				.join(' ')
		}

		if (SELF_CLOSING_ELEMENTS.includes(element.tagName)) return `${tag}>`
		else if (element.innerHTML != null) return `${tag}>${element.innerHTML}</${element.tagName}>`
		else return `${tag}>${HTMLService.escape(element.innerText ?? '')}</${element.tagName}>`
	}
}
