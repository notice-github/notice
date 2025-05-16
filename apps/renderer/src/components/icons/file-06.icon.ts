import { RenderComponent, html } from '@root/system'

export const FILE_06_ICON = {
	NAME: 'file-06' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M14 2v5l1 1h5m-4 5H8m8 4H8m2-8H8m6-7H6L4 4v16l2 2h12l2-2V8l-6-6Z"/></svg>`
	},
} satisfies RenderComponent<'icon'>
