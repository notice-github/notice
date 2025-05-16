import { RenderComponent, html } from '@root/system'

export const HASH_02_ICON = {
	NAME: 'hash-02' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M9 3 6 21M18 3l-3 18m6-13H4m16 8H3"></svg>
		`
	},
} satisfies RenderComponent<'icon'>
