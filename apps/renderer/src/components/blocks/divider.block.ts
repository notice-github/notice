import { RenderComponent, css, html } from '@root/system'

export const DIVIDER_BLOCK = {
	NAME: 'divider' as const,
	HTML: (ctx) => {
		const { _id } = ctx.block

		return html`<hr id="${_id}" class="block-divider" />`
	},
	CSS: css`
		.block-divider {
			margin: var(--ntc-app-spacing-sm) 0;

			width: 100%;
			height: 1px;
			color: var(--ntc-user-border-color);
			background-color: var(--ntc-user-border-color);
		}
	`,
	MARKDOWN: (ctx) => '---',
} satisfies RenderComponent<'block'>
