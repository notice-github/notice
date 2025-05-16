import { RenderComponent, css, html } from '@root/system'

export const LINK_LEAF = {
	NAME: 'link' as const,
	HTML: (text, value: string) => {
		return html`<a class="text-link" target="_blank" href="${value}">${text}</a>`
	},
	CSS: css`
		.text-link {
			text-decoration: none;
			color: var(--ntc-user-accent-color);
		}
	`,
	MARKDOWN: (text, value) => `[${text}](${value})`,
} satisfies RenderComponent<'leaf'>
