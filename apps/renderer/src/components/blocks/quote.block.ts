import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const QUOTE_BLOCK = {
	NAME: 'quote' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block

		return html`<blockquote id="${_id}" class="block-quote">${RenderService.renderLeaves(ctx)}</blockquote>`
	},
	CSS: css`
		.block-quote {
			display: inline-block;
			width: 100%;

			border-left: 3px solid #6b7985;
			caret-color: #444756;

			margin: var(--ntc-user-block-padding) 0px var(--ntc-user-block-padding) 0px;
			padding: var(--ntc-app-spacing-xs) 0px var(--ntc-app-spacing-xs) var(--ntc-app-spacing-lg);

			line-height: var(--ntc-user-p-line-height);

			word-break: normal;
		}
	`,
	MARKDOWN: (ctx) => `> ${RenderService.renderLeaves(ctx, 'MARKDOWN')}`,
} satisfies RenderComponent<'block'>
