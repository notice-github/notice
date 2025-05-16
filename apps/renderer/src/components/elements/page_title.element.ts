import { HTMLService } from '@root/services/html.service'
import { RenderComponent, css, html } from '@root/system'

export const PAGE_TITLE_ELEMENT = {
	NAME: 'page_title' as const,
	HTML: (ctx) => {
		return html`
			<h1 class="page-title">${HTMLService.escape(ctx.block.data.text) || ctx.textOf('Untitled', 'Untitled')}</h1>
		`
	},
	CSS: css`
		.page-title {
			font-size: 23px;
			font-weight: var(--ntc-user-h1-weight);
			align-self: flex-start;
		}

		@container wrapper (min-width: 768px) {
			.page-title {
				font-size: 23px;
			}
		}
		@container wrapper (min-width: 1240px) {
			.page-title {
				font-size: 30px;
			}
		}
	`,
} satisfies RenderComponent<'element'>
