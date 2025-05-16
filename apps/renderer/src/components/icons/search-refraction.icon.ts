import { RenderComponent, html } from '@root/system'

export const SEARCH_REFRACTION_ICON = {
	NAME: 'search-refraction' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"></svg>`
	},
} satisfies RenderComponent<'icon'>
