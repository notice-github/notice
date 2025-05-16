import { RenderComponent, html } from '@root/system'

export const ARROW_NARROW_RIGHT_ICON = {
	NAME: 'arrow-narrow-right' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M4 12H20M20 12L14 6M20 12L14 18"></svg>`
	},
} satisfies RenderComponent<'icon'>
