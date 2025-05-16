import { ICONS } from '@root/components/icons'
import { RenderComponent, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'

export const HOME_BUTTON_ELEMENT = {
	NAME: 'home_button' as const,
	HTML: (ctx) => {
		const url = Helpers.getUrl(ctx.navigationType, ctx.rootBlock._id)
		//TODO: change the navigation function to just remove the page query
		return html`
			<a src="${url}" onclick="return false;">
				<div class="icon-button-container" onclick="$NTC.navigateTo('${ctx.rootBlock._id}')">
					${ICONS['home-03'].HTML(18)}
				</div>
			</a>
		`
	},
} satisfies RenderComponent<'element'>
