import { RenderComponent, css, html } from '@root/system'

export const STRIKETHROUGH_LEAF = {
	NAME: 'strikethrough' as const,
	HTML: (text) => {
		return html`<s class="text-strikethrough">${text}</s>`
	},
	CSS: css`
		.text-strikethrough {
			text-decoration: line-through;
		}
	`,
	MARKDOWN: (text) => `~~${text}~~`,
} satisfies RenderComponent<'leaf'>
