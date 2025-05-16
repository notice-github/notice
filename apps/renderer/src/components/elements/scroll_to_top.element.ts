import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const SCROLL_TO_TOP_ELEMENT = {
	NAME: 'scroll_to_top' as const,
	HTML: () => {
		return html`
			<div class="scroll-to-top-button" onclick="$NTC.scrollToTop()">
				<p>Go to top</p>
				${ICONS['chevron-up-double'].HTML(18)}
			</div>
		`
	},
	CSS: css`
		.scroll-to-top-button {
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;
			gap: var(--ntc-app-spacing-sm);
			color: var(--ntc-user-font-color);

			transition: color 0.2s ease;
			cursor: pointer;

			${MIXINS['flex-centered']}
		}

		.scroll-to-top-button svg {
			align-self: center;
			transition: stroke 0.2s ease;
		}

		.scroll-to-top-button:hover {
			color: var(--ntc-user-highlight-color);
		}

		.scroll-to-top-button:hover svg {
			stroke: var(--ntc-user-highlight-color);
		}
	`,
} satisfies RenderComponent<'element'>
