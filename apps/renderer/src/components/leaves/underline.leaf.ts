import { RenderComponent, css, html } from '@root/system'

export const UNDERLINE_LEAF = {
	NAME: 'underline' as const,
	HTML: (text) => {
		return html`<u class="text-underline">${text}</u>`
	},
	CSS: css`
		.text-underline {
			text-decoration: underline;
		}
	`,
	MARKDOWN: (text) => text,
} satisfies RenderComponent<'leaf'>
