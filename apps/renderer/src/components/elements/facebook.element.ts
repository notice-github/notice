import { ICONS } from '@root/components/icons'
import { RenderComponent, html } from '@root/system'

export const FACEBOOK_ELEMENT = {
	NAME: 'facebook' as const,
	HTML: () => {
		return html`
			<span class="social-facebook icon-button-container" onclick="$NTC.shareTo('facebook')">
				${ICONS['social-facebook-01'].HTML(18)}
			</span>
		`
	},
} satisfies RenderComponent<'element'>
