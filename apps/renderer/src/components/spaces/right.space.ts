import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { ELEMENTS } from '../elements'

export const RIGHT_SPACE = {
	NAME: 'right' as const,
	HTML: (ctx) => {
		const { anchor } = ctx.layout.right_space

		return html`<div class="space-right">${RenderService.renderHTMLIf(ctx, ELEMENTS['anchor'], anchor.show)}</div>`
	},
	CSS: css`
		.space-right {
			grid-column: 2;
			grid-row: 3;
			height: 0px;
		}

		@container wrapper (min-width: 1240px) {
			.space-right {
				grid-column: 3;
				grid-row: 2 / 5;
				height: auto;
			}
		}
	`,
} satisfies RenderComponent<'space'>
