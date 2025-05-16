import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const CREATED_WITH_NOTICE_TEXT_ELEMENT = {
	NAME: 'created_with_notice_text' as const,
	HTML: (ctx) => {
		const { hideNoticePoweredBy } = ctx.rootBlock.preferences ?? {}

		if (hideNoticePoweredBy) return ''

		return html`
			<a class="created_with_notice_text_container" href="https://notice.studio" target="_blank">
				${ICONS['notice-logo'].HTML(18)}
				<span class="created_with_notice_text">${ctx.textOf('CreatedWithNotice', 'Created with Notice')}</span>
			</a>
		`
	},
	CSS: css`
		.created_with_notice_text_container {
			gap: var(--ntc-app-spacing-sm);
			align-self: center;
			padding: var(--ntc-app-spacing-2xl);
			color: inherit;

			grid-column: 2;
			grid-row: 6;
			${MIXINS['flex-row-centered']}
			text-decoration: none;
		}

		.created_with_notice_text {
			font-size: 0.875em;
			margin-top: var(--ntc-app-spacing-sm);
		}
	`,
} satisfies RenderComponent<'element'>
