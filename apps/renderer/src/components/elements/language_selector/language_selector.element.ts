import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, css, html } from '@root/system'

export const LANGUAGE_SELECTOR_ELEMENT = {
	NAME: 'language_selector' as const,
	HTML: (ctx) => {
		return html`
			<div
				id="language-selector-button"
				onclick="$NTC.handleLanguageMenu()"
				class="icon-button-container selector-button"
			>
				${ICONS['globe-02'].HTML(16)}
			</div>
		`
	},
	CSS: css`
		.selector-button:has(.language-menu[data-show='true']) {
			background-color: var(--ntc-light-bg-color);
		}
	`,
	JS: {
		createPopperInstance(isASubmenu?: boolean) {
			const id = isASubmenu ? '#action-menu-lang-button' : '#language-selector-button'
			const placement = isASubmenu ? 'left' : 'bottom'

			const button = $NTC.wrapper.querySelector(id)
			const menu = $NTC.wrapper.querySelector('#language-menu')

			// @ts-ignore
			const popperInstance = Popper.createPopper(button, menu, {
				placement: placement,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 8],
						},
					},
				],
			})

			return popperInstance
		},
		handleLanguageMenu(isASubmenu?: boolean) {
			const id = isASubmenu ? '#action-menu-lang-button' : '#language-selector-button'
			// TODO: make this a global menu component and have a global listener
			const menu = $NTC.wrapper.querySelector('#language-menu')
			const button = $NTC.wrapper.querySelector(id)

			const popperInstance = $NTC.createPopperInstance(isASubmenu)

			menu.setAttribute('data-show', 'true')

			//SOURCE: https://popper.js.org/docs/v2/tutorial/#performance
			popperInstance.setOptions((options) => ({
				...options,
				modifiers: [...options.modifiers, { name: 'eventListeners', enabled: true }],
			}))

			// Update its position
			popperInstance.update()

			const closeLanguageMenu = (event: Event) => {
				const isClickInside = menu.contains(event.target as HTMLElement)
				const isLangButtonClicked = button.contains(event.target as HTMLElement)

				if (!isClickInside && !isLangButtonClicked) {
					menu.setAttribute('data-show', 'false')

					popperInstance.setOptions((options) => ({
						...options,
						modifiers: [...options.modifiers, { name: 'eventListeners', enabled: false }],
					}))
				}
			}

			$NTC.wrapper.addEventListener('click', closeLanguageMenu)
		},
	},
} satisfies RenderComponent<'element'>
