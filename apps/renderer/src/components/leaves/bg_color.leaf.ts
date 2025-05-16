import { RenderComponent, html } from '@root/system'

export const BG_COLOR_LEAF = {
	NAME: 'bgColor' as const,
	HTML: (text, value: string) => {
		return html`<span style="background-color: ${value}">${text}</span>`
	},
} satisfies RenderComponent<'leaf'>
