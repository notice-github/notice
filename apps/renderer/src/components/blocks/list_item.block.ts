import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const LIST_ITEM_BLOCK = {
	NAME: 'list-item' as const,
	HTML: (ctx) => {
		const { _id } = ctx.block

		return html`<li id="${_id}" class="block-list-item">${RenderService.renderLeaves(ctx)}</li>`
	},
	MARKDOWN: (ctx) => `- ${RenderService.renderLeaves(ctx, 'MARKDOWN')}`,
	CSS: css`
		.block-list-item {
			line-height: var(--ntc-user-p-line-height);
		}
	`,
} satisfies RenderComponent<'block'>
