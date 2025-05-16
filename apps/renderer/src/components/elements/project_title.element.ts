import { HTMLService } from '@root/services/html.service'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { Helpers } from '../../tools/helpers.tool'

export const PROJECT_TITLE_ELEMENT = {
	NAME: 'project_title' as const,
	HTML: (ctx) => {
		if (!ctx.pageTree) return ''

		const title = ctx.rootBlock.preferences?.projectTitle ?? ctx.pageTree?.data?.text

		const url = Helpers.getUrl(ctx.navigationType, ctx.rootBlock._id)

		return html`
			<a class="project-title-link" href="${url}" onclick="return false;">
				<h1 class="project-title" onclick="$NTC.navigateTo('${ctx.rootBlock._id}')">
					${HTMLService.escape(title || ctx.textOf('Untitled', 'Untitled'))}
				</h1>
			</a>
		`
	},
	CSS: css`
		.project-title-link {
			text-decoration: none;
		}

		.project-title {
			font-weight: var(--ntc-user-h1-weight);
			font-size: 1em;
			word-break: break-all;
			cursor: pointer;

			${MIXINS['multiline-ellipsis']}
		}

		@container wrapper (min-width: 768px) {
			.project-title {
				font-size: 1.3em;
			}
		}
		@container wrapper (min-width: 1240px) {
			.project-title {
				font-size: var(--ntc-user-h1-size);
			}
		}
	`,
	JS: {
		intersection() {
			const bottomActions = document.querySelector('.bottom_action_element')
			const bottomSpace = document.querySelector('.bottom_space')

			const handler = (entries) => {
				if (!entries[0].isIntersecting) {
					bottomActions.classList.remove('bottom_action_placed')
					bottomActions.classList.add('bottom_action_floating')
				} else {
					bottomActions.classList.remove('bottom_action_floating')
					bottomActions.classList.add('bottom_action_placed')
				}
			}

			// create the observer
			const observer = new window.IntersectionObserver(handler)

			// give the observer some dom nodes to keep an eye on
			observer.observe(bottomSpace)
		},
	},
} satisfies RenderComponent<'element'>
