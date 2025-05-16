import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, css, html } from '@root/system'
import { ACTION_SELECTOR_MENU_ELEMENT } from './action_selector_menu.element'

export const ACTION_SELECTOR_BUTTON_ELEMENT = {
	NAME: 'action_selector_button' as const,
	HTML: (ctx) => {
		return html`
			<div
				id="action-selector-button"
				class="icon-button-container action-selector-button"
				onclick="$NTC.openActionSelectorMenu()"
			>
				${ICONS['dots-vertical'].HTML(18)} ${ACTION_SELECTOR_MENU_ELEMENT.HTML(ctx)}
			</div>
		`
	},
	CSS: css`
		.action-selector-button {
			border-radius: var(--ntc-app-border-radius-round);
		}
		.action-selector-button:has(.action-menu[data-show='true']) {
			background-color: var(--ntc-light-bg-color);
		}
	`,
	JS: {
		createActionPopperInstance() {
			const button = $NTC.wrapper.querySelector('#action-selector-button')
			const menu = $NTC.wrapper.querySelector('#action-menu')

			// @ts-ignore
			const popperInstance = Popper.createPopper(button, menu, {
				placement: 'bottom-start',
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
		openActionSelectorMenu() {
			// TODO: make this a global menu component and have a global listener
			const menu = $NTC.wrapper.querySelector('#action-menu')
			const button = $NTC.wrapper.querySelector('#action-selector-button')
			const menuItem = menu.querySelector('.NTC_action-menu-item')

			const popperInstance = $NTC.createActionPopperInstance()

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
				const isMenuButtonClicked = button.contains(event.target as HTMLElement)

				if (!isClickInside && !isMenuButtonClicked) {
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
