import { RenderComponent, css, html } from '@root/system'

export const ITALIC_LEAF = {
	NAME: 'italic' as const,
	HTML: (text) => {
		return html`<i class="text-italic">${text}</i>`
	},
	CSS: css`
		.text-italic {
			font-style: italic;
		}
	`,
	MARKDOWN: (text) => `*${text}*`,
} satisfies RenderComponent<'leaf'>
