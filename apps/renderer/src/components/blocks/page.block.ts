import { BMSBlockModel } from '@notice-app/models'
import { NUrls } from '@notice-app/tools'
import { HTMLService } from '@root/services/html.service'
import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'
import { ICONS } from '../icons'

// TODO: Get a new design from helen for two variants one for doc and another for blog
export const PAGE_BLOCK = {
	NAME: 'page' as const,
	HTML: (ctx) => {
		const { block } = ctx
		const { data } = block

		const { text, displaySummary, displayCover, displayBorder, cover } = data || {}
		const hasCover = displayCover && cover

		const summary = displaySummary ? `<div class="page-summary">${createPageSummary(block)}</div>` : ''

		const coverImage = `<div class="page-cover-image"><img class="page-img" src="${cover}" alt='page_cover'></div>`
		const pageIcon = `<span class="page-icon">${ICONS['arrow-narrow-right'].HTML(28)}</span>`

		const rightElement = hasCover ? coverImage : pageIcon

		// Check for false, so every other values fall back to bordered page (retrocompatible).
		const border = displayBorder !== false ? 'border-page' : ''

		let url = Helpers.getUrl(ctx.navigationType, block.metadata?.slug || block._id)

		const pageBlock = html`
			<a class="page-link-a" href="${url}" onclick="return false;">
				<div class="block-page ${border}" onclick="$NTC.navigateTo('${block.metadata?.slug || block._id}')">
					<div class="page-text-wrapper">
						<div class="page-link-title">${HTMLService.escape(text) || ctx.textOf('Untitled', 'Untitled')}</div>
						${summary}
					</div>
					${rightElement}
				</div>
			</a>
		`

		return pageBlock
	},
	CSS: css`
		.page-link-a {
			text-decoration: none;
			color: inherit;
			width: 100%;
			height: fit-content;
			padding-bottom: var(--ntc-app-spacing-md);
			padding-top: var(--ntc-app-spacing-md);
		}

		.block-page {
			box-sizing: border-box;
			padding: var(--ntc-user-block-padding);
			border-radius: var(--ntc-app-border-radius-md);

			width: 100%;
			height: 100%;
			min-height: calc(var(--ntc-app-sizing-lg) + 4px);

			color: var(--ntc-user-font-color);

			transition: transform ease 0.25s;

			gap: var(--ntc-app-spacing-md);
			cursor: pointer;

			${MIXINS['flex-spaced-between']}
		}

		.block-page:hover {
			color: var(--ntc-user-accent-color);
			transform: translateY(-3px);
		}

		.border-page {
			border: var(--ntc-user-border-width) solid var(--ntc-user-border-color);
		}

		.border-page > .page-text-wrapper {
			padding: 0px var(--ntc-app-spacing-xl);
		}

		.page-text-wrapper {
			display: flex;
			padding-right: var(--ntc-app-spacing-xl);
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			max-height: var(--ntc-app-page-cover-height);

			flex: 1;

			gap: var(--ntc-app-spacing-md);
		}

		.page-link-title {
			font-weight: var(--ntc-app-font-weight-xl);
			font-size: 16px;

			color: inherit;
			${MIXINS['multiline-ellipsis']}
		}

		.page-summary {
			font-weight: var(--ntc-app-font-weight-md);
			color: var(--ntc-light-font-color);
			opacity: 0.7;
			font-size: 14px;

			${MIXINS['multiline-ellipsis']}
		}

		.page-cover-image {
			box-sizing: border-box;
			position: relative;
			width: var(--ntc-app-page-cover-width-sm);
			height: var(--ntc-app-page-cover-height-sm);
			overflow: hidden;
		}

		.page-img {
			${MIXINS['size-100']}
			object-fit: cover;
			background-color: transparent;
			border-radius: var(--ntc-app-border-radius-sm);
		}

		.page-icon {
			${MIXINS['size-auto']}
			${MIXINS['flex-centered']}

			margin: auto;
			cursor: pointer;
		}

		.block-page:hover svg {
			stroke: var(--ntc-user-accent-color);
		}

		@container wrapper (min-width: 600px) {
			.page-link-title {
				font-size: 18px;
			}

			.page-cover-image {
				width: var(--ntc-app-page-cover-width-lg);
				height: var(--ntc-app-page-cover-height-lg);
			}

			.page-summary {
				font-size: 16px;
			}
		}
	`,
	MARKDOWN: (ctx) => {
		const { block, rootBlock } = ctx
		const baseUrl = NUrls.App.wildcardURL(rootBlock._id, rootBlock.preferences?.customDomain)
		const url = `${baseUrl}${Helpers.getUrl(ctx.navigationType, block._id)}`
		return `[${block?.data?.text}](${url})`
	},
	JS: {},
} satisfies RenderComponent<'block'>

export function createPageSummary(block: BMSBlockModel.graph) {
	const { blocks } = block
	let summary = ''

	if (block.metadata?.summary) return block.metadata.summary
	const textBlocks = blocks.filter((b) => ['header-1', 'header-2', 'header-3', 'paragraph'].includes(b.type))

	for (let block of textBlocks) {
		const leaves = block.data?.leaves
		// let's not include empty blocks
		if (leaves.length === 1 && leaves[0].text === '') continue
		const texts = leaves
			.reduce((acc: any, leaf: Record<string, string>) => acc + HTMLService.escape(leaf.text), '')
			.split(/\s+/)
			.filter((word: string) => word && word !== '' && word !== '')
		if (!texts.length) continue
		for (let text of texts) {
			if (summary.length + text.length > 197) {
				return summary + '...'
			} else {
				summary += (summary.length > 0 ? ' ' : '') + text
			}
		}
	}

	return summary
}
