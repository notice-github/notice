import { RenderComponent, css, html } from '@root/system'

export const BREADCRUMB_MENU_COMPONENT = {
	NAME: 'breadcrumb_menu_component' as const,
	HTML: (menuItems) => {
		return html`
			<div
				id="breadcrumb_menu"
				class="menu_wrapper display_none cursor_pointer direction_column justify_start align_center"
				role="listbox"
			></div>
		`
	},
	CSS: css`
		.breadcrumb_menu_active {
			animation: fade_in 0.3s ease-in;
		}

		.breadcrumb_menu_hide {
			animation: fade_out 0.3s ease-out;
		}
	`,
	JS: {
		openBreadcrumbMenu() {
			const breadcrumbMenu = document.getElementById('breadcrumb_menu')
			const breadcrumbMenuButton = document.getElementById('breadcrumb_selector_button')

			breadcrumbMenu.classList.remove('NTC_breadcrumb_menu_hide')

			// Popper.createPopper(breadcrumbMenuButton, breadcrumbMenu, {
			// 	placement: 'bottom',
			// 	modifiers: [
			// 		{
			// 			name: 'offset',
			// 			options: {
			// 				offset: [0, 8],
			// 			},
			// 		},
			// 	],
			// })
			breadcrumbMenu.style.display = 'flex'
			breadcrumbMenuButton.style.background = 'var(--ntc-dark-bg-color)'
			breadcrumbMenu.classList.add('NTC_breadcrumb_menu_active')
		},

		closeBreadcrumbMenu() {
			const breadcrumbMenu = document.getElementById('breadcrumb_menu')
			const breadcrumbMenuButton = document.getElementById('breadcrumb_selector_button')

			breadcrumbMenu.classList.remove('NTC_breadcrumb_menu_active')

			breadcrumbMenu.classList.add('NTC_breadcrumb_menu_hide')

			setTimeout(() => {
				breadcrumbMenu.style.display = 'none'
				breadcrumbMenuButton.style.background = ''
				this.putBackFilledIcon()
			}, 150)
		},
	},
} satisfies RenderComponent<'element'>
