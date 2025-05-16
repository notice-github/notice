import { RenderComponent, css, html } from '@root/system'

export const CODE_LEAF = {
	NAME: 'code' as const,
	HTML: (text) => {
		return html`<code class="text-code">${text}</code>`
	},
	CSS: css`
		.text-code {
			word-break: keep-all;
			white-space: break-spaces;

			padding: var(--ntc-app-spacing-xs) var(--ntc-app-spacing-sm);

			border-radius: var(--ntc-app-border-radius-md);

			margin: 0 calc(var(--ntc-app-border-radius-xs) - 1px);

			font-weight: var(--ntc-app-font-weight-sm);
			font-family: monospace;

			background-color: rgba(250, 239, 240, 0.78);
			color: #b44437;
		}
	`,
	MARKDOWN: (text) => `\`${text}\``,
} satisfies RenderComponent<'leaf'>
