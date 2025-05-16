import { NIterators } from '@notice-app/tools'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { BLOCKS } from '../blocks'

export const RELATED_ARTICLES_ELEMENT = {
	NAME: 'read_more' as const,
	HTML: (ctx) => {
		const parentOf = (pageId: string) => {
			let parent: any

			NIterators.walkGraph(ctx.pageTree, (node, _parent) => {
				if (node._id === pageId) parent = _parent ?? node
			})

			return parent
		}

		const getRelatedArticles = () => {
			if (ctx.rootBlock._id === ctx.block._id) return []
			const parent = parentOf(ctx.block._id)
			if (!parent) return []
			const pages = parent.blocks.filter((block: any) => block.type === 'page') as any[]

			const pageIndex = pages.findIndex((page) => page._id === ctx.block._id)

			const total = 4
			const relatedArticles = []
			let pointerBefore = pageIndex - 1
			let pointerAfter = pageIndex + 1

			for (let i = 0; i < 8 && relatedArticles.length < total; i++) {
				const before = pages[pointerBefore]
				const after = pages[pointerAfter]
				if (i % 2 && before) {
					relatedArticles.push(before)
					pointerBefore--
				} else if (after) {
					relatedArticles.push(after)
					pointerAfter++
				}
			}

			return relatedArticles
		}

		const relatedArticles = getRelatedArticles()

		if (!relatedArticles.length) return ``

		return html`
			<hr class="read-more-separator" />
			<div class="read-more-text">${ctx.textOf('ReadMore', 'Read More')}</div>
			<div class="related-articles">
				${relatedArticles.map((article) => html`${BLOCKS['page'].HTML({ ...ctx, block: article })}`).join('')}
			</div>
		`
	},
	CSS: css`
		.read-more-separator {
			border: 1px solid var(--ntc-dark-bg-color);
		}
		.read-more-text {
			font-weight: var(--ntc-app-font-weight-md);
			font-size: var(--ntc-user-h3-size);

			align-self: flex-start;

			margin: var(--ntc-app-spacing-2xl) 0;
		}

		.related-articles {
			${MIXINS['flex-column-centered']}
			width: 100%;
			margin-bottom: var(--ntc-app-spacing-lg);
		}
	`,
} satisfies RenderComponent<'element'>
