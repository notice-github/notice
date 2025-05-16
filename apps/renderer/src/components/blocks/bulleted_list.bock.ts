import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const BULLET_LIST_BLOCK = {
	NAME: 'bulleted-list' as const,
	HTML: (ctx) => {
		const { _id } = ctx.block

		return html`
			<ul id="${_id}" class="block-bulleted-list">
				${RenderService.renderBlocks(ctx)}
			</ul>
		`
	},
	CSS: css`
		.block-bulleted-list {
			margin: 0px;

			/* do not modify padding left and right, let the browser defaults */
			padding-top: var(--ntc-user-block-padding);
			padding-bottom: var(--ntc-user-block-padding);
		}
	`,
	MARKDOWN: (ctx) => {
		return RenderService.renderBlocks(ctx, 'MARKDOWN')
	},
} satisfies RenderComponent<'block'>
