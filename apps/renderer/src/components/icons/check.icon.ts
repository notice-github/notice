import { RenderComponent, html } from '@root/system'

export const CHECK_ICON = {
	NAME: 'check' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M20 6L9 17L4 12"></svg>`
	},
} satisfies RenderComponent<'icon'>
