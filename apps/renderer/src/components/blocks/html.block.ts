import { RenderComponent, html } from '@root/system'
import { load } from 'cheerio'

export const HTML_BLOCK = {
	NAME: 'html' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block

		const $ = load(data.code, null, false)

		// Make sure that HTML elements created by the user will not be prefixed (e.g. by .NTC_*)
		$('*').attr('class-prefix', 'none')

		return html`<div id="${_id}" class="block-html">${$.html()}</div>`
	},
} satisfies RenderComponent<'block'>
