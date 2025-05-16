import { BMSBlockModel } from '@notice-app/models'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { PAGE_TREE_ITEM_ELEMENT } from './page_tree_item.element'
import { PAGE_TREE_SECTION_ELEMENT } from './page_tree_section.element'

export const PAGE_TREE_ELEMENT = {
	NAME: 'page_tree' as const,
	HTML: (ctx, depth = 0) => {
		let currentSection: string | undefined

		const renderPage = (page: BMSBlockModel.graph) => {
			let section = ''
			if (page.metadata?.section !== currentSection) {
				section = PAGE_TREE_SECTION_ELEMENT.HTML(ctx, page.metadata.section)
				currentSection = page.metadata.section
			}

			return html`${section}${PAGE_TREE_ITEM_ELEMENT.HTML(ctx, page, depth)}`
		}

		return html`<div class="page-tree" data-depth="${depth}">${ctx.pageTree.blocks.map(renderPage).join('')}</div>`
	},
	CSS: css`
		.page-tree {
			gap: var(--ntc-app-spacing-md);
			width: 100%;
			${MIXINS['flex-column-align-start']}
		}
	`,
} satisfies RenderComponent<'element'>
