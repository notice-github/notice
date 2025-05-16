import { RenderComponent, css, html } from '@root/system'

export const BOLD_LEAF = {
	NAME: 'bold' as const,
	HTML: (text) => {
		return html`<b class="text-bold">${text}</b>`
	},
	CSS: css`
		.text-bold {
			font-weight: var(--ntc-app-font-weight-xl);
		}
	`,
	MARKDOWN: (text) => `**${text}**`,
} satisfies RenderComponent<'leaf'>
