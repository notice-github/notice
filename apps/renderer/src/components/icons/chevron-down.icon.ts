import { RenderComponent, html } from '@root/system'

export const CHEVRON_DOWN_ICON = {
	NAME: 'chevron-down' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M6 9L12 15L18 9"></svg>`
	},
} satisfies RenderComponent<'icon'>
