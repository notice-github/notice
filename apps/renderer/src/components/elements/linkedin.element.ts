import { ICONS } from '@root/components/icons'
import { RenderComponent, html } from '@root/system'

export const LINKEDIN_ELEMENT = {
	NAME: 'linkedin' as const,
	HTML: (ctx) => {
		const title = ctx.rootBlock.data.title ?? ''

		return html`
			<span class="social-linkedin icon-button-container" onclick="$NTC.shareTo('linkedin', '${title}')">
				${ICONS['social-linkedin-01'].HTML(18)}
			</span>
		`
	},
} satisfies RenderComponent<'element'>
