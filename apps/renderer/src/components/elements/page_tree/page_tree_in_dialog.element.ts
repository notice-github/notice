import { ICONS } from '@root/components/icons'
import { HTMLService } from '@root/services/html.service'
import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { PAGE_TREE_ELEMENT } from './page_tree.element'

export const PAGE_TREE_IN_DIALOG_ELEMENT = {
	NAME: 'page-tree-in-dialog' as const,
	HTML: (ctx) => {
		return html`
			<div class="icon-button-container burger-icon" onclick="$NTC.openPageTreeDrawer()">
				${ICONS['menu-01'].HTML(16)}
			</div>
			<dialog id="page-tree-dialog" class="page-tree-dialog">
				<div class="page-tree-drawer" data-is-active="false">
					<div class="page-tree-drawer-header">
						<h3 class="page-tree-drawer-header-title" onclick="$NTC.navigateTo('${ctx.rootBlock._id}')">
							${HTMLService.escape(ctx.pageTree.data.text)}
						</h3>
						<span class="icon-button-container page-tree-drawer-close-button" onclick="$NTC.closePageTreeDrawer()">
							${ICONS['chevron-down'].HTML(24)}
						</span>
					</div>
					<nav class="page-tree-drawer-nav">${PAGE_TREE_ELEMENT.HTML(ctx)}</nav>
				</div>
			</dialog>
		`
	},
	CSS: css`
		.burger-icon {
			display: flex;
			height: var(--ntc-app-sizing-sm);
			width: var(--ntc-app-sizing-sm);
			flex-shrink: 0;
		}

		.page-tree-dialog {
			overflow: hidden;

			background-color: transparent;
			border: none;
			margin: 0;
			padding: 0;

			width: 100%;
			height: 100%;

			max-width: 100%;
			max-height: 100%;
		}

		.page-tree-dialog[open]::backdrop {
			animation: backdrop-fade-in 0.2s ease-in-out;
			background-color: rgba(27, 30, 33, 0.77);
		}

		.page-tree-dialog-body {
			position: relative;
			width: 100%;
			height: 100%;
		}

		.page-tree-drawer {
			width: 100%;
			height: 100%;
			overflow-y: auto;

			padding: var(--ntc-app-spacing-2xl) var(--ntc-app-spacing-lg);
			background-color: var(--ntc-user-bg-color);

			max-width: calc(var(--ntc-app-sizing-2xl) * 2);

			transform: translateX(-100%);
			transition: transform 0.3s ease-in-out;
		}

		.page-tree-drawer[data-is-active='true'] {
			transform: translateX(0);
			transition: transform 0.3s ease-in-out;
		}

		.page-tree-drawer-header {
			${MIXINS['flex-row-space-between']}
			width: 100%;
			margin-bottom: var(--ntc-app-spacing-2xl);
			gap: var(--ntc-app-spacing-md);
		}

		.page-tree-drawer-header-title {
			cursor: pointer;
			${MIXINS['text-ellipsis']}
		}

		.page-tree-drawer-close-button {
			transform: rotate(90deg);
			margin-left: auto;
			flex-shrink: 0;
		}

		.page-tree-drawer-nav {
			width: 100%;
		}

		@keyframes backdrop-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@container wrapper (min-width: 1240px) {
			.burger-icon {
				display: none;
			}
		}
	`,
	JS: {
		stopPropagation(event: Event) {
			event.stopPropagation()
		},

		openPageTreeDrawer() {
			const dialog = document.getElementById('page-tree-dialog') as HTMLDialogElement
			const drawer = dialog.querySelector('.NTC_page-tree-drawer')

			dialog.showModal()
			drawer.setAttribute('data-is-active', 'true')

			const onClick = (e: Event) => {
				const node = e.target as HTMLElement

				if (node.nodeName === 'DIALOG') {
					$NTC.closePageTreeDrawer()
					return
				}
			}
			const onClose = () => {
				dialog.removeEventListener('click', onClick)
				dialog.removeEventListener('close', onClose)
			}

			dialog.addEventListener('click', onClick)
			dialog.addEventListener('close', onClose)
		},

		closePageTreeDrawer() {
			const dialog = document.getElementById('page-tree-dialog') as HTMLDialogElement
			if (!dialog) return

			if (!dialog.open) return

			const drawer = dialog.querySelector('.NTC_page-tree-drawer')
			if (!drawer) return

			drawer.setAttribute('data-is-active', 'false')

			setTimeout(() => {
				dialog.close()
			}, 300)
		},
	},
} satisfies RenderComponent<'element'>
