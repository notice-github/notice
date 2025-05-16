import { ICONS } from '@root/components/icons'
import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const EXPANDABLE_BLOCK = {
	NAME: 'expandable' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block

		if (ctx.isExporting) {
			return html`
				<details id="${_id}" class="block-expandable">
					<summary class="expandable-title">${data.title ?? ''}</summary>
					${RenderService.renderBlocks(ctx)}
				</details>
			`
		}

		return html`
			<div id="${_id}" aria-expanded="false" class="block-expandable expandable-${data.variant ?? 'bottom-bordered'}">
				<div class="expandable-header" onclick="$NTC.toggleExpandable('${_id}')">
					<h5 class="expandable-header-text">${data.title ?? ''}</h5>
					<div class="expandable-expand-icon">${ICONS['chevron-down'].HTML(24)}</div>
				</div>
				<div class="expandable-content">
					<div class="content-overflow-checker">${RenderService.renderBlocks(ctx)}</div>
				</div>
			</div>
		`
	},

	CSS: css`
		.content-overflow-checker > *:last-child {
			margin-bottom: var(--ntc-app-spacing-2xl);
		}
		.block-expandable {
			width: 100%;
			box-sizing: border-box;
		}

		.expandable-header {
			box-sizing: border-box;
			padding: var(--ntc-app-spacing-md);
			color: var(--ntc-user-font-color);
			cursor: pointer;

			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.expandable-header h5 {
			width: 100%;
			color: inherit;
			font-weight: 500;
			font-size: var(--ntc-user-expandable-header-size);
			padding-right: 8px;

			white-space: pre-wrap;
			word-break: keep-all;
		}

		.expandable-header:hover {
			color: var(--ntc-user-accent-color);
		}

		.expandable-header:hover svg {
			stroke: var(--ntc-user-accent-color);
		}

		.expandable-expand-icon {
			margin: 0 calc(var(--ntc-app-spacing-md) + var(--ntc-app-spacing-xs));
			height: var(--ntc-app-sizing-sm);
			width: var(--ntc-app-sizing-sm);

			${MIXINS['flex-centered']}
		}

		.block-expandable[aria-expanded='true'] .expandable-expand-icon svg {
			transform: rotate(180deg);
		}

		.expandable-expand-icon svg {
			transform: rotate(0);
			transition: transform 0.3s ease-in-out;
		}

		.expandable-content {
			display: grid;
			grid-template-rows: 0fr;
			transition: grid-template-rows 500ms;
			padding: 0 var(--ntc-app-spacing-xl);
		}

		.content-overflow-checker {
			overflow: hidden;
		}

		.block-expandable[aria-expanded='true'] .expandable-content {
			grid-template-rows: 1fr;
		}

		.expandable-bottom-bordered {
			border-bottom: 1px solid var(--ntc-dark-bg-color);
		}
		.expandable-fully-bordered {
			border: 1px solid var(--ntc-dark-bg-color);
		}
		.expandable-top-bordered {
			border-top: 1px solid var(--ntc-dark-bg-color);
		}
	`,
	MARKDOWN: (ctx) => {
		const { data } = ctx.block

		return `## ${data.title ?? ''}\n${RenderService.renderBlocks(ctx, 'MARKDOWN')}`
	},

	JS: {
		toggleExpandable(id: string) {
			const expandable = document.getElementById(id)

			if (!expandable) return null

			const isExpanded = expandable.getAttribute('aria-expanded')

			if (isExpanded === 'true') {
				expandable.setAttribute('aria-expanded', 'false')
			} else {
				expandable.setAttribute('aria-expanded', 'true')
			}
		},
	},
} satisfies RenderComponent<'block'>
