import { RenderComponent, html } from '@root/system'

export const MENU_01_ICON = {
	NAME: 'menu-01' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M3 12H21M3 6H21M3 18H21"></svg>`
	},
} satisfies RenderComponent<'icon'>
