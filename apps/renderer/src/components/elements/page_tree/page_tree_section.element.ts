import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const PAGE_TREE_SECTION_ELEMENT = {
	NAME: 'page-tree-section' as const,
	HTML: (_, text: string) => {
		return html` <div class="page-tree-section">${text}</div> `
	},
	CSS: css`
		.page-tree-section {
			width: 100%;

			font-weight: var(--ntc-app-font-weight-xl);
			font-size: 0.7em;

			padding: 0 calc(var(--ntc-app-spacing-xl) + var(--ntc-app-spacing-sm));
			color: var(--ntc-user-font-color);
			margin-top: var(--ntc-app-spacing-md);
			margin-bottom: var(--ntc-app-spacing-md);

			user-select: none;
			text-transform: uppercase;
			text-align: start;

			${MIXINS['text-ellipsis']}
		}
	`,
} satisfies RenderComponent<'element'>
