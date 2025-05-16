import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const NUMBERED_LIST_BLOCK = {
	NAME: 'numbered-list' as const,
	HTML: (ctx) => {
		const { _id } = ctx.block

		return html`
			<ol id="${_id}" class="block-numbered-list">
				${RenderService.renderBlocks(ctx)}
			</ol>
		`
	},
	CSS: css`
		.block-numbered-list {
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
