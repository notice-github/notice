import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { ICONS } from '../icons'

const typeToIconSize = {
	'header-1': 18,
	'header-2': 17,
	'header-3': 14,
}

export const HEADER_BLOCK = {
	NAME: 'header' as const,
	HTML: (ctx) => {
		const { _id, type, data } = ctx.block

		const text = RenderService.renderLeaves(ctx)

		const leavesText = Helpers.leavesToText(data.leaves)
		const tag = `h${type.split('-')[1]}`
		const split_id = _id.slice(0, 4)
		// get the same heading id matching the one inside the document
		const slug = Helpers.slugOf(leavesText) + '-' + split_id

		const header = (content: string) =>
			`<${tag} id="${_id}" slug-id="${slug}" class="block-header ${type}">${content}</${tag}>`

		if (ctx.isExporting) return header(text)

		const anchorLink = text.trim()
			? html` <span class="header-anchor" onclick="$NTC.navigateToAndSetAnchor('${slug}')">
					${ICONS['hash-02'].HTML(typeToIconSize[type])}
			  </span>`
			: ''

		return header(html` ${text || '&#160;'} ${anchorLink}`)
	},
	CSS: css`
		.block-header {
			cursor: default;
			width: fit-content;
		}

		.block-header:hover .header-anchor {
			display: inline-flex;
		}

		.header-anchor {
			display: none;
			align-self: center;

			width: min-content;
			height: min-content;

			transition: all 0.2s;
			cursor: pointer;
		}

		.header-anchor:hover svg {
			stroke: var(--ntc-user-accent-color);
		}

		.header-1 {
			font-size: var(--ntc-user-h1-size);
			font-weight: var(--ntc-user-h1-weight);
			padding: var(--ntc-user-headings-padding);
		}

		.header-2 {
			font-size: var(--ntc-user-h2-size);
			font-weight: var(--ntc-user-h2-weight);
			padding: var(--ntc-user-headings-padding);
		}

		.header-3 {
			font-size: var(--ntc-user-h3-size);
			font-weight: var(--ntc-user-h3-weight);
			padding: var(--ntc-user-headings-padding);
		}
	`,
	JS: {},
	MARKDOWN: (ctx) => {
		const { type } = ctx.block
		const headingLevel = parseInt(type.substring(type.length - 1))
		return `${'#'.repeat(headingLevel)} ${RenderService.renderLeaves(ctx, 'MARKDOWN')}`
	},
} satisfies RenderComponent<'block'>
