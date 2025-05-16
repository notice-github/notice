import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { ELEMENTS } from '../elements'

export const HEADER_SPACE = {
	NAME: 'header' as const,
	HTML: (ctx) => {
		const { logo, title } = ctx.layout.header_space
		const { page_tree } = ctx.layout.left_space
		const displayPageTreeButton = ctx.layout.left_space.show && page_tree.show

		return html`
			<div class="space-header">
				<div class="header-right-elements">
					${RenderService.renderHTMLIf(ctx, ELEMENTS['page-tree-in-dialog'], displayPageTreeButton)}
					${RenderService.renderHTMLIf(ctx, ELEMENTS['logo'], logo.show)}
					${RenderService.renderHTMLIf(ctx, ELEMENTS['project_title'], title.show)}
				</div>
			</div>
		`
	},
	CSS: css`
		.space-header {
			grid-column: 1 / span 3;
			grid-row: 1;
			border-bottom: 1px solid var(--ntc-dark-bg-color);

			padding: var(--ntc-app-spacing-lg);
			width: 100%;
			height: fit-content;

			${MIXINS['flex-row-space-between']}
		}

		.header-right-elements {
			align-self: flex-start;

			${MIXINS['flex-row-start']}
			gap: var(--ntc-app-spacing-md);
		}
	`,
	JS: {
		openLeftSpaceDrawer() {},
	},
} satisfies RenderComponent<'space'>
