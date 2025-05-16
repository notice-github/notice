import { BMSBlockModel } from '@notice-app/models'
import { ICONS } from '@root/components/icons'
import { HTMLService } from '@root/services/html.service'
import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'

type DirectionType = 'next' | 'previous'

export const BOTTOM_NAV_LINK_ELEMENT = {
	NAME: 'bottom_nav_link' as const,
	HTML: (ctx, block: BMSBlockModel.graph, pageDirection: DirectionType) => {
		const linkTitle = pageDirection === 'next' ? 'Next Page' : 'Previous Page'
		const translationKey = pageDirection === 'next' ? 'nextPage' : 'previousPage'
		const url = Helpers.getUrl(ctx.navigationType, block.metadata?.slug || block._id)

		return html`
			<a class="bottom_page-link" href="${url}" onclick="return false;">
				<div
					class="bottom_page_button"
					data-direction="${pageDirection}"
					onclick="$NTC.navigateTo('${block.metadata?.slug || block._id}')"
				>
					<div class="bottom_page_button_text_container">
						<h5 class="bottom_page_button_title">${ctx.textOf(translationKey, linkTitle)}</h5>
						<div class="bottom_page_button_name">
							${HTMLService.escape(block.data.text) || ctx.textOf('Untitled', 'Untitled')}
						</div>
					</div>
					${ICONS['arrow-narrow-right'].HTML(28)}
				</div>
			</a>
		`
	},
	CSS: css`
		.bottom_page-link {
			text-decoration: none;
			width: var(--ntc-app-width-half);
			flex-grow: 3;
		}

		.bottom_page_button {
			width: 100%;
			cursor: pointer;

			border-radius: var(--ntc-app-border-radius-md);
			text-decoration: none;

			border: var(--ntc-user-border-width) solid var(--ntc-user-border-color);

			padding: var(--ntc-app-spacing-xl);

			background-color: inherit;
			color: var(--ntc-user-font-color);
			transition: all 0.2s;
			gap: var(--ntc-app-spacing-lg);

			${MIXINS['flex-row-space-between']}
		}

		.bottom_page_button[data-direction='previous'] {
			flex-direction: row-reverse;
		}

		.bottom_page_button:hover {
			transform: translateY(-2px);
			color: var(--ntc-user-accent-color);
		}

		.bottom_page_button svg {
			transition: all 0.2s;
			flex-shrink: 0;
		}

		.bottom_page_button[data-direction='previous'] svg {
			transform: rotate(180deg);
		}

		.bottom_page_button:hover svg {
			stroke: var(--ntc-user-accent-color);
		}

		.bottom_page_button_text_container {
			width: 100%;

			gap: var(--ntc-app-spacing-md);
			min-width: 0;
			${MIXINS['flex-column']}
		}

		.bottom_page_button[data-direction='previous'] > .bottom_page_button_text_container {
			align-items: flex-end;
		}

		.bottom_page_button_title {
			font-size: 0.8em;
			color: var(--ntc-light-font-color);
		}

		.bottom_page_button_name {
			width: 100%;
			font-weight: var(--ntc-app-font-weight-sm);
			font-size: 0.9em;

			color: inherit;

			min-width: 0;
			text-align: start;
			flex-grow: 0;
			${MIXINS['text-ellipsis']}
		}

		.bottom_page_button[data-direction='previous'] > .bottom_page_button_text_container > .bottom_page_button_name {
			text-align: end;
		}
	`,
} satisfies RenderComponent<'element'>
