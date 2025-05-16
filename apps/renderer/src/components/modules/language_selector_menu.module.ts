import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const LANGUAGE_SELECTOR_MENU_MODULE = {
	NAME: 'language_selector_menu_module' as const,
	HTML: (ctx) => {
		const { availableLanguages, defaultLanguage, addLangQuery } = ctx.rootBlock.preferences ?? {}
		const languages = Array.from(new Set([defaultLanguage, ...availableLanguages]))

		return html`
			<div
				id="language-menu"
				data-show="false"
				data-state-type="${addLangQuery ? 'query' : 'memory'}"
				class="language-menu"
			>
				${languages
					.filter((lang) => lang != null)
					.map((lang) => {
						return html`
							<div
								class="language-menu-item"
								id="lang-${lang}"
								data-is-selected="${ctx.lang === lang}"
								onclick="$NTC.selectLang('${lang}')"
							>
								<div class="language-menu-outer-circle">
									<div class="language-menu-inner-circle"></div>
								</div>
								<span>${lang.toUpperCase()}</span>
							</div>
						`
					})
					.join('')}
			</div>
		`
	},
	CSS: css`
		.language-menu {
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

		.language-menu[data-show='true'] {
			display: flex;
			animation: fade_in 0.1s ease-in;
		}

		.language-menu[data-show='false'] {
			animation: fade_out 0.1s ease-out;
		}

		.language-menu-item {
			${MIXINS['flex-row-start']}
			gap: var(--ntc-app-spacing-md);

			width: 100%;
			padding: var(--ntc-app-spacing-md);
			border-radius: var(--ntc-app-border-radius-sm);

			background-color: transparent;
			transition: all 0.1s ease-in-out;
		}

		.language-menu-item:hover {
			background-color: var(--ntc-light-bg-color);
		}

		.language-menu-outer-circle {
			${MIXINS['flex-centered']}
			box-sizing: unset;
			border: 2px solid var(--ntc-user-font-color);

			width: var(--ntc-app-sizing-xxs);
			height: var(--ntc-app-sizing-xxs);

			border-radius: var(--ntc-app-border-radius-round);
		}

		.language-menu-inner-circle {
			display: none;
			width: calc(var(--ntc-app-sizing-xxs) - 4px);
			height: calc(var(--ntc-app-sizing-xxs) - 4px);

			background-color: var(--ntc-user-font-color);
			border-radius: var(--ntc-app-border-radius-round);

			animation: fade_in 0.1s linear;
		}

		.language-menu-item[data-is-selected='true'] > .language-menu-outer-circle > .language-menu-inner-circle {
			display: block;
		}
	`,
	JS: {
		selectLang(lang: string) {
			$NTC.lang = lang
			$NTC.updateLangSelector()

			const langMenu = $NTC.wrapper.querySelector('.NTC_language-menu')
			setTimeout(() => langMenu.setAttribute('data-show', 'false'), 150)

			if (langMenu.getAttribute('data-state-type') === 'query') {
				const url = new URL(window.location.href)
				url.searchParams.set('lang', `${lang}`)
				window.history.pushState(null, '', `${url.search}`)
			}

			$NTC.reload()
		},

		updateLangSelector() {
			const menuItems = $NTC.wrapper.querySelectorAll('.NTC_language-menu-item')

			if (!menuItems) return null

			menuItems.forEach((menuItem) => {
				const itemId = menuItem.getAttribute('id').split('lang-')[1]
				menuItem.setAttribute('data-is-selected', `${itemId === $NTC.lang}`)
			})
		},
	},
} satisfies RenderComponent<'element'>
