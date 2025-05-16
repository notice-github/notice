import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { ELEMENTS } from '../elements'

export const LEFT_SPACE = {
	NAME: 'left' as const,
	HTML: (ctx) => {
		const { page_tree } = ctx.layout.left_space

		return html`
			<div class="space-left">
				<nav class="page-tree-container">${RenderService.renderHTMLIf(ctx, ELEMENTS['page_tree'], page_tree.show)}</nav>
			</div>
		`
	},
	CSS: css`
		.space-left {
			grid-column: 1;
			grid-row: 2 / 5;
			position: absolute;
		}

		.page-tree-container {
			display: none;
			width: var(--ntc-app-sizing-3xl);
			height: 100%;

			padding-top: var(--ntc-app-spacing-xl);
			padding-bottom: var(--ntc-app-spacing-3xl);
			padding-left: var(--ntc-app-spacing-lg);
			padding-right: var(--ntc-app-spacing-lg);

			border-right: 1px solid var(--ntc-dark-bg-color);

			overflow: auto;
		}

		@container wrapper (min-width: 1240px) {
			.space-left {
				position: sticky;
				height: 100vh;
				top: 0;
			}

			.page-tree-container {
				display: block;
			}
		}
	`,
} satisfies RenderComponent<'space'>
