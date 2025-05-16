import { RenderComponent, html } from '@root/system'

export const X_CLOSE_ICON = {
	NAME: 'x-close' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M18 6L6 18M6 6L18 18"></svg>`
	},
} satisfies RenderComponent<'icon'>
