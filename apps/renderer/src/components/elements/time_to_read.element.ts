import { RenderComponent, html } from '@root/system'

export const TIME_TO_READ_ELEMENT = {
	NAME: 'time_to_read' as const,
	HTML: (ctx) => {
		const ttr = ctx.block.metadata?.timeToRead ?? 0
		if (ttr <= 0) return ''

		return html`
			<div class="time-to-read">
				<p><span id="time-to-read-value">${Math.ceil(ttr / 60)}</span> min to read</p>
			</div>
		`
	},
} satisfies RenderComponent<'element'>
