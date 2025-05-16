import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, html } from '@root/system'

export const THEME_SWITCH_ELEMENT = {
	NAME: 'theme_switch' as const,
	HTML: (ctx) => {
		return html`
			<div class="icon-button-container" onclick="$NTC.toggleDarkMode(event)">
				${ctx.theme === 'dark' ? ICONS.sun.HTML(20) : ICONS['moon-01'].HTML(18)}
			</div>
		`
	},
	JS: {
		toggleDarkMode(e: Event) {
			const button = e.currentTarget as HTMLDivElement
			if (button.getAttribute('data-loading') === 'true') return

			const isDarkMode = localStorage.getItem('NTC_theme') === 'dark'
			$NTC.theme = isDarkMode ? 'light' : 'dark'
			localStorage.setItem('NTC_theme', $NTC.theme)

			button.setAttribute('data-loading', 'true')

			$NTC.reload().then(() => {
				button.removeAttribute('data-loading')
			})
		},
	},
} satisfies RenderComponent<'element'>
