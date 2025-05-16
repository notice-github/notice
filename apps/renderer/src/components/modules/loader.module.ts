import { RenderComponent, css, html } from '@root/system'

export const LOADER_MODULE = {
	NAME: 'loader' as const,
	HTML: () => {
		return html`<span class="loader"></span>`
	},
	CSS: css`
		.loader {
			display: inline-block;
			box-sizing: border-box;
			align-self: center;

			width: var(--ntc-app-sizing-md);
			height: var(--ntc-app-sizing-md);

			border: 3px solid var(--ntc-user-highlight-color);
			border-bottom-color: transparent;
			border-radius: var(--ntc-app-border-radius-round);

			animation: rotation 1s linear infinite;
		}
	`,
} satisfies RenderComponent<'module'>
