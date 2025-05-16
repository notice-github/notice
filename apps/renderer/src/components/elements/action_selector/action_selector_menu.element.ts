import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const ACTION_SELECTOR_MENU_ELEMENT = {
	NAME: 'action_selector_menu' as const,
	HTML: (ctx) => {
		const { availableLanguages } = ctx.rootBlock.preferences ?? {}
		const { search, theme_switch, contact_form, language_selector } = ctx.layout.top_space

		const displayLangButton = language_selector.show && availableLanguages && availableLanguages.length > 0

		const searchButton = search.show
			? html`
					<div class="action-menu-item" onclick="$NTC.openSearch()">
						${ICONS['icon_search-md'].HTML(18)} <span>Search</span>
					</div>
			  `
			: ''

		const themeButton = theme_switch.show
			? html`
					<div class="action-menu-item" onclick="$NTC.toggleDarkMode(event)">
						${ctx.theme === 'dark' ? ICONS.sun.HTML(20) : ICONS['moon-01'].HTML(18)}
						<span>${ctx.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
					</div>
			  `
			: ''

		const contactButton = contact_form.show
			? html`
					<div class="action-menu-item" onclick="$NTC.openContactForm()">
						${ICONS['mail-03'].HTML(18)} <span>Contact Us</span>
					</div>
			  `
			: ''
		const langButtonWithMenu = displayLangButton
			? html`
					<div id="action-menu-lang-button" class="action-menu-item" onclick="$NTC.handleLanguageMenu('${true}')">
						${ICONS['globe-02'].HTML(18)} <span>${ctx.lang}</span>
					</div>
			  `
			: ''

		return html`
			<div id="action-menu" data-show="false" class="action-menu">
				${searchButton} ${themeButton} ${contactButton} ${langButtonWithMenu}
			</div>
		`
	},
	CSS: css`
		.action-menu {
			${MIXINS['flex-column-align-start']}
			display: none;
			cursor: pointer;

			background-color: var(--ntc-user-bg-color);
			box-shadow: rgb(0 0 0 / 10%) 0px 2px 7px;

			overflow-y: auto;
			overflow-x: hidden;
			overscroll-behavior: none;

			max-height: calc(var(--ntc-app-sizing-2xl) + 100px);
			width: calc(var(--ntc-app-sizing-2xl) - var(--ntc-app-sizing-sm));

			gap: var(--ntc-app-spacing-md);
			padding: var(--ntc-app-spacing-sm);

			z-index: var(--ntc-app-zIndex-menu);
			border-radius: var(--ntc-app-border-radius-md);
		}

		.action-menu[data-show='true'] {
			display: flex;
			animation: fade_in 0.1s ease-in;
		}

		.action-menu[data-show='false'] {
			animation: fade_out 0.1s ease-out;
		}

		.action-menu-item {
			${MIXINS['flex-row-start']}
			gap: var(--ntc-app-spacing-md);

			width: 100%;
			padding: var(--ntc-app-spacing-md);
			border-radius: var(--ntc-app-border-radius-sm);

			background-color: transparent;
			transition: all 0.1s ease-in-out;
		}

		.action-menu-item svg {
			stroke: var(--ntc-user-font-color);
		}

		.action-menu-item:hover {
			background-color: var(--ntc-light-bg-color);
		}
	`,
	JS: {},
} satisfies RenderComponent<'element'>
