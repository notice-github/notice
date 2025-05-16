import { BMSBlockModel } from '@notice-app/models'
import { ICONS } from '@root/components/icons'
import { HTMLService } from '@root/services/html.service'
import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'

export const BREADCRUMB_ELEMENT = {
	NAME: 'breadcrumb' as const,
	HTML: (ctx) => {
		const findActivePages = (
			block: BMSBlockModel.graph,
			activePages: Record<string, string>[],
			currentBlockId: string
		) => {
			const { blocks } = block

			if (block._id === currentBlockId) {
				return activePages
			}

			for (let block of blocks) {
				if (block.type === 'page') {
					const newActivePages = findActivePages(
						block,
						[...activePages, { id: block._id, name: block.data.text, slug: block.metadata?.slug }],
						currentBlockId
					)
					if (newActivePages != undefined) {
						return newActivePages
					}
				}
			}
		}
		const activePages = findActivePages(
			ctx.pageTree,
			[{ id: ctx.pageTree._id, name: ctx.pageTree.data.text }],
			ctx.block._id
		)
		const getArrowIcon = (index: number) => (activePages.length - 1 !== index ? ICONS['chevron-down'].HTML(18) : '')
		const getBreadcrumbUrl = (idOrSlug: string) => Helpers.getUrl(ctx.navigationType, idOrSlug)

		const breadCrumbNodes = activePages
			.map(
				({ name, id, slug }, index: number) =>
					html`<a class="breadcrumb-link" href="${getBreadcrumbUrl(slug || id)}" onclick="return false;">
							<div
								class="breadcrumb-button"
								onclick="$NTC.navigateTo('${slug || id}')"
								data-active-breadcrumb="${id === ctx.block._id}"
							>
								<span class="breadcrumb-button-text"
									>${HTMLService.escape(name) || ctx.textOf('Untitled', 'Untitled')}</span
								>
							</div>
						</a>
						${getArrowIcon(index)}`
			)
			.join('')

		return html` <div class="breadcrumbs">${breadCrumbNodes}</div> `
	},
	CSS: css`
		.breadcrumbs {
			box-sizing: border-box;
			height: var(--ntc-app-sizing-sm);
			width: 100%;

			gap: var(--ntc-app-spacing-sm);
			overflow: auto;

			${MIXINS['flex-row-start']}
		}

		.breadcrumb-link {
			text-decoration: none;
		}

		.breadcrumb-button {
			height: 100%;
			max-width: calc(var(--ntc-app-sizing-3xl) / 2);
			border-radius: var(--ntc-app-spacing-sm);
			transition: all 0.2s;
			padding: 0 calc(var(--ntc-app-spacing-sm) + 2px);
			flex-shrink: 0;
			cursor: pointer;
			text-decoration: none;

			${MIXINS['flex-centered']}
		}

		.breadcrumb-button:hover {
			background-color: var(--ntc-light-bg-color);
		}

		.breadcrumb-button-text {
			color: var(--ntc-user-font-color);
			font-size: 1em;
			${MIXINS['text-ellipsis']}
		}

		.breadcrumbs svg {
			transform: rotate(-90deg);
			flex-shrink: 0;
			margin-top: var(--ntc-app-spacing-xs);
		}

		.breadcrumb-button[data-active-breadcrumb='true'] {
			background-color: var(--ntc-dark-bg-color);
		}
	`,
} satisfies RenderComponent<'element'>
