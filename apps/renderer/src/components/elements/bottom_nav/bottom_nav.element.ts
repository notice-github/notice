import { BMSBlockModel } from '@notice-app/models'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { BOTTOM_NAV_LINK_ELEMENT } from './bottom_nav_link.element'

export const BOTTOM_NAV_ELEMENT = {
	NAME: 'bottom_nav' as const,
	HTML: (ctx) => {
		const getFlattenedPages = (block: BMSBlockModel.graph, pages: BMSBlockModel.graph[], rootId?: string) => {
			const { blocks } = block

			if (rootId && block._id) {
				pages.push(block)
			}

			blocks.forEach((block: BMSBlockModel.graph) => {
				if (block.type === 'page') {
					pages.push(block)
					if (block.blocks.length !== 0) {
						getFlattenedPages(block, pages)
					}
				}
			})
			return pages
		}
		const flattenedPages = getFlattenedPages(ctx.pageTree, [], ctx.rootBlock._id)

		const currentPageIndex = flattenedPages.findIndex((page) => {
			return page._id === ctx.block._id
		})

		const pages = {
			previous: flattenedPages[currentPageIndex - 1],
			next: flattenedPages[currentPageIndex + 1],
		}

		const nextPage = pages.next ? BOTTOM_NAV_LINK_ELEMENT.HTML(ctx, pages.next, 'next') : ''
		const perviousPage = pages.previous ? BOTTOM_NAV_LINK_ELEMENT.HTML(ctx, pages.previous, 'previous') : ''

		return html` <div class="bottom_nav">${perviousPage} ${nextPage}</div> `
	},
	CSS: css`
		.bottom_nav {
			gap: var(--ntc-app-spacing-lg);
			margin-bottom: var(--ntc-app-spacing-lg);
			width: 100%;

			${MIXINS['flex-row-centered']}
			flex-wrap: wrap;
		}
	`,
} satisfies RenderComponent<'element'>
