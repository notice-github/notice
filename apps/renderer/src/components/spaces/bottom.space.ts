import { ELEMENTS } from '@root/components/elements'
import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

export const BOTTOM_SPACE = {
	NAME: 'bottom' as const,
	HTML: (ctx) => {
		const { twitter, facebook, linkedin, bottom_nav, read_more } = ctx.layout.bottom_space

		return html`
			<div class="space-bottom">
				<div class="bottom-space-action-elements">
					<div class="bottom-space-social-elements">
						${RenderService.renderHTMLIf(ctx, ELEMENTS['twitter'], twitter.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['facebook'], facebook.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['linkedin'], linkedin.show)}
					</div>
				</div>
				${RenderService.renderHTMLIf(ctx, ELEMENTS['bottom_nav'], bottom_nav.show)}
				${RenderService.renderHTMLIf(ctx, ELEMENTS['read_more'], read_more.show)}
			</div>
		`
	},
	CSS: css`
		.space-bottom {
			grid-column: 2;
			grid-row: 5;
			height: fit-content;

			padding: var(--ntc-app-spacing-md);
		}

		.bottom-actions {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;

			margin: var(--ntc-app-spacing-lg) 0;
			padding: 0 var(--ntc-app-spacing-xs);
		}

		.bottom-left-actions {
		}

		.bottom-right-actions {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			gap: var(--ntc-app-spacing-xs);
		}

		.bottom-navigation {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: var(--ntc-app-spacing-xs);
		}

		.bottom-space-action-elements {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: flex-end;

			margin: var(--ntc-app-spacing-lg) 0;
			padding: 0 var(--ntc-app-spacing-xs);

			width: 100%;
		}

		.bottom-space-social-elements {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
			gap: var(--ntc-app-spacing-xs);
		}

		.bottom_space_info {
			font-size: 0.9em;
		}
	`,
} satisfies RenderComponent<'space'>
