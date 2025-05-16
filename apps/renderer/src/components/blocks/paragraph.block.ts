import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const PARAGRAPH_BLOCK = {
	NAME: 'paragraph' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { leaves } = data

		if (data?.leaves?.length === 1 && leaves[0].text === '')
			return html`<p class="block-paragraph" id="${_id}">
				<br />
			</p>`

		return html`<p id="${_id}" class="block-paragraph">${RenderService.renderLeaves(ctx)}</p>`
	},
	CSS: css`
		.block-paragraph {
			padding: var(--ntc-user-block-padding) 0px var(--ntc-user-block-padding) 0px;
			line-height: var(--ntc-user-p-line-height);
		}
	`,
	MARKDOWN: (ctx) => {
		return RenderService.renderLeaves(ctx, 'MARKDOWN')
	},
} satisfies RenderComponent<'block'>
