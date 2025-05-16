import { RenderComponent, html } from '@root/system'

export const CHEVRON_UP_DOUBLE_ICON = {
	NAME: 'chevron-up-double' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M17 18L12 13L7 18M17 11L12 6L7 11"></svg>`
	},
} satisfies RenderComponent<'icon'>
