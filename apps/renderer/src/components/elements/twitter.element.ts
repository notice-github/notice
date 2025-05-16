import { ICONS } from '@root/components/icons'
import { HTMLService } from '@root/services/html.service'
import { RenderComponent, html } from '@root/system'

export const TWITTER_ELEMENT = {
	NAME: 'twitter' as const,
	HTML: (ctx) => {
		const title = HTMLService.escape(ctx.rootBlock.data.text ?? '')
		const iconColor = ctx.theme === 'dark' ? 'black' : 'white'

		return html`
			<span class="social-twitter icon-button-container" onclick="$NTC.shareTo('twitter', '${title}')">
				${ICONS['social-twitter-01'].HTML(16, iconColor)}
			</span>
		`
	},
} satisfies RenderComponent<'element'>
