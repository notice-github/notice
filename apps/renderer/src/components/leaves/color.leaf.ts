import { RenderComponent, html } from '@root/system'

export const COLOR_LEAF = {
	NAME: 'color' as const,
	HTML: (text, value: string) => {
		return html`<span style="color: ${value}">${text}</span>`
	},
} satisfies RenderComponent<'leaf'>
