import { BMSBlockModel } from '@notice-app/models'
import { ICONS } from '@root/components/icons'
import { HTMLService } from '@root/services/html.service'
import { $NTC, RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'
import { PAGE_TREE_ELEMENT } from './page_tree.element'

export const PAGE_TREE_ITEM_ELEMENT = {
	NAME: 'page-tree-item' as const,

	HTML: (ctx, page: BMSBlockModel.graph, depth = 0) => {
		let children = ''
		if (page.blocks.length > 0) {
			children = PAGE_TREE_ELEMENT.HTML({ ...ctx, pageTree: page }, depth + 1)
		}

		const childContainer = children
			? html`<div class="page-tree-child">
					<div class="page-tree-overflow-checker">${children}</div>
			  </div>`
			: ''

		const actionContainer = children
			? html`
					<span class="page-tree-expand-button" onclick="$NTC.expandPageTreeItem(event, '${page._id}')">
						${ICONS['chevron-down'].HTML(18)}
					</span>
			  `
			: ''

		const url = Helpers.getUrl(ctx.navigationType, page.metadata?.slug || page._id)

		return html` <div id="${page._id}" class="page-tree-item" aria-expanded="${Helpers.isMyChild(page, ctx.block._id)}">
			<a class="page-tree-link" src="${url}" onclick="return false;">
				<div
					class="page-tree-button"
					data-is-active="${ctx.block._id === page._id}"
					onclick="$NTC.navigateTo('${page.metadata?.slug || page._id}')"
				>
					<span class="page-tree-icon">${ICONS['file-06'].HTML(16)}</span>
					<span class="page-tree-text"
						>${HTMLService.escape(page.data.text) || ctx.textOf('Untitled', 'Untitled')}
					</span>
					${actionContainer}
				</div>
			</a>
			${childContainer}
		</div>`
	},
	CSS: css`
		.page-tree-item {
			box-sizing: border-box;

			width: 100%;
			height: auto;
		}

		.page-tree-link {
			width: 100%;
			text-decoration: none;
		}

		.page-tree-button {
			width: 100%;
			cursor: pointer;
			padding: var(--ntc-app-spacing-sm) var(--ntc-app-spacing-lg);

			text-decoration: none;
			min-height: calc(var(--ntc-app-sizing-md) + 5px);

			border-radius: var(--ntc-app-border-radius-md);
			gap: var(--ntc-app-spacing-sm);

			color: var(--ntc-user-font-color);
			transition: all 0.2s ease;
			${MIXINS['flex-row-start']}
		}

		.page-tree-button:hover {
			background-color: var(--ntc-light-bg-color);
		}

		.page-tree-button[data-is-active='true'] {
			background-color: var(--ntc-light-bg-color);
			color: var(--ntc-user-accent-color);
		}

		.page-tree-expand-button {
			cursor: pointer;
			box-sizing: border-box;
			border-radius: var(--ntc-app-spacing-sm);
			transition: all 0.2s ease-in;
			margin-left: auto;

			${MIXINS['flex-centered']}
		}

		.page-tree-expand-button:hover {
			background-color: var(--ntc-dark-bg-color);
		}

		.page-tree-expand-button svg {
			transition: transform 0.2s ease-in-out;
			border-radius: 4px;
		}

		.page-tree-item[aria-expanded='true'] > .page-tree-link > .page-tree-button > .page-tree-expand-button svg {
			transform: rotate(180deg);
		}

		.page-tree-button[data-is-active='true'] .page-tree-expand-button svg {
			stroke: var(--ntc-user-accent-color);
		}

		.page-tree-icon {
			${MIXINS['flex-centered']}
		}

		.page-tree-text {
			font-size: 0.9em;
			user-select: none;
			${MIXINS['text-ellipsis']}
		}

		.page-tree-icon svg {
			transition: stroke 0.2s ease-in;
		}

		.page-tree-button[data-is-active='true'] .page-tree-icon svg {
			stroke: var(--ntc-user-accent-color);
		}

		.page-tree-child {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows 500ms;

			border-left: 1px solid var(--ntc-light-bg-color);

			margin-left: var(--ntc-app-spacing-xl);
			padding-left: var(--ntc-app-spacing-md);
		}

		.page-tree-item[aria-expanded='true'] > .page-tree-child {
			grid-template-rows: 1fr;
			margin-bottom: var(--ntc-app-spacing-sm);
			margin-top: var(--ntc-app-spacing-sm);
		}

		.page-tree-overflow-checker {
			overflow: hidden;
		}
	`,

	JS: {
		expandPageTreeItem(event: Event, id: string) {
			if (event) event.stopPropagation()

			const pageTreeItems = $NTC.wrapper.querySelectorAll('.NTC_page-tree-item')

			pageTreeItems.forEach((pageTreeItem) => {
				const pageTreeItemId = pageTreeItem.getAttribute('id')

				if (pageTreeItemId === id) {
					const isExpanded = pageTreeItem.getAttribute('aria-expanded')

					if (isExpanded === 'true') {
						pageTreeItem.setAttribute('aria-expanded', 'false')
					} else {
						pageTreeItem.setAttribute('aria-expanded', 'true')
					}
				}
			})
		},
	},
} satisfies RenderComponent<'element'>
