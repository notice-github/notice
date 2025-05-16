import { MODULES } from '@root/components/modules'
import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { ELEMENTS } from '../elements'

export const TOP_SPACE = {
	NAME: 'top' as const,
	HTML: (ctx) => {
		const {
			page_title,
			home_button,
			time_to_read,
			twitter,
			linkedin,
			facebook,
			search,
			logo,
			theme_switch,
			contact_form,
			language_selector,
			breadcrumb,
		} = ctx.layout.top_space

		const { availableLanguages } = ctx.rootBlock.preferences ?? {}

		const showHomeButton = home_button.show && ctx.rootBlock._id !== ctx.block._id
		const displayLanguageSelector = language_selector.show && availableLanguages && availableLanguages.length > 0

		const dividerCircle =
			(twitter.show || linkedin.show || facebook.show) && time_to_read.show
				? html` <span class="top-space-divider-circle"></span> `
				: ''

		const renderMobileActionMenu = search.show || contact_form.show || theme_switch.show || displayLanguageSelector

		return html`
			<div class="space-top">
				<div class="top-space-first-row">
					<div class="top-space-title-logo">
						${RenderService.renderHTMLIf(ctx, ELEMENTS['logo'], logo.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['page_title'], page_title.show)}
					</div>

					<div class="hidden-in-desktop">
						${RenderService.renderHTMLIf(ctx, ELEMENTS['home_button'], showHomeButton)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['action_selector_button'], renderMobileActionMenu)}
					</div>
				</div>

				<div class="top-space-second-row">
					<div class="top-space-meta-container">
						${RenderService.renderHTMLIf(ctx, ELEMENTS['time_to_read'], time_to_read.show)} ${dividerCircle}
						<div class="top-space-social-elements">
							${RenderService.renderHTMLIf(ctx, ELEMENTS['twitter'], twitter.show)}
							${RenderService.renderHTMLIf(ctx, ELEMENTS['facebook'], facebook.show)}
							${RenderService.renderHTMLIf(ctx, ELEMENTS['linkedin'], linkedin.show)}
						</div>
					</div>

					<div class="hidden-in-mobile">
						${RenderService.renderHTMLIf(ctx, ELEMENTS['home_button'], showHomeButton)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['search'], search.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['theme_switch'], theme_switch.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['contact_form_button'], contact_form.show)}
						${RenderService.renderHTMLIf(ctx, ELEMENTS['language_selector'], displayLanguageSelector)}
					</div>
				</div>

				${RenderService.renderHTMLIf(ctx, ELEMENTS['breadcrumb'], breadcrumb.show)}
				${RenderService.renderHTMLIf(ctx, ELEMENTS['contact_form_dialog'], contact_form.show)}
				${RenderService.renderHTMLIf(ctx, ELEMENTS['search_in_dialog'], search.show)}
				${RenderService.renderHTMLIf(ctx, MODULES['language_selector_menu_module'], displayLanguageSelector)}
			</div>
		`
	},
	CSS: css`
		.space-top {
			grid-column: 2;
			grid-row: 2;

			padding-top: var(--ntc-app-spacing-xl);
			padding-right: var(--ntc-app-spacing-md);
			padding-left: var(--ntc-app-spacing-md);
			/* no padding bottom here, we let the content_space set it */

			gap: var(--ntc-app-spacing-md);

			font-size: 0.9em;
			height: fit-content;

			${MIXINS['flex-column']}
		}

		.top-space-first-row {
			${MIXINS['flex-row-space-between']}
			align-items: flex-start;
			gap: var(--ntc-app-spacing-md);
			width: 100%;
		}

		.top-space-first-row:first-child {
			align-self: flex-start;
		}

		.top-space-title-logo {
			${MIXINS['flex-row-centered']}
			gap: var(--ntc-app-spacing-md);
		}

		.hidden-in-desktop {
			display: flex;
			flex-direction: row;
		}

		.top-space-second-row {
			${MIXINS['flex-row-centered']}
			flex-wrap: wrap;
		}

		.top-space-meta-container {
			${MIXINS['flex-row-start']}
			flex-wrap: wrap;
			flex-grow: 2;
		}

		.top-space-social-elements {
			${MIXINS['flex-row-end']}
			gap: var(--ntc-app-spacing-xs);
		}

		.hidden-in-mobile {
			display: none;
		}

		.top-space-divider-circle {
			height: calc(var(--ntc-app-sizing-xxs) - 3px);
			width: calc(var(--ntc-app-sizing-xxs) - 3px);

			margin: auto var(--ntc-app-spacing-lg);
			border-radius: var(--ntc-app-border-radius-round);
			background-color: var(--ntc-dark-bg-color);
		}

		@container wrapper (min-width: 600px) {
			.hidden-in-mobile {
				display: flex;
			}
			.hidden-in-desktop {
				display: none;
			}
		}

		@container wrapper (min-width: 1240px) {
			.space-top {
				grid-column: 2;
				grid-row: 2;
				padding-top: calc(var(--ntc-app-spacing-3xl) + var(--ntc-app-spacing-md));
			}
		}
	`,
} satisfies RenderComponent<'space'>
