import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'

export const CREATED_WITH_NOTICE_BOX_ELEMENT = {
	NAME: 'created_with_notice_box' as const,
	HTML: () => {
		return html`
			<div class="created_with_notice_box_container flex_row flex_center">
				${ICONS['notice-logo'].HTML(36)}
				<span class="created_with_notice_text">Created with <strong>Notice</strong> </span>
			</div>
		`
	},
	CSS: css`
		.created_with_notice_box_container {
			padding: var(--ntc-app-spacing-md) var(--ntc-app-spacing-lg);
			border-radius: 6px;

			background-color: var(--ntc-light-bg-color);
			color: var(--ntc-user-font-color);

			box-sizing: border-box;
			gap: var(--ntc-app-spacing-md);
			z-index: 100;

			font-size: 1em;
		}

		.created_with_notice_text {
			font-size: 0.875em;
			margin-top: var(--ntc-app-spacing-sm);
		}
	`,
} satisfies RenderComponent<'element'>
