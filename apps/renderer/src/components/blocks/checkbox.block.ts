import { ICONS } from '@root/components/icons'
import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const CHECKBOX_BLOCK = {
	NAME: 'checkbox' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block

		if (ctx.isExporting) {
			return html`
				<div class="block-checkbox">
					<input id="${_id}" type="checkbox" name="checkbox-${_id}" checked="${data.checked}" />
					<label for="checkbox-${_id}">${RenderService.renderLeaves(ctx)}</label>
				</div>
			`
		}

		return html`
			<div id="${_id}" aria-checked="${data.checked}" class="block-checkbox">
				<div class="checkbox-input">${ICONS['check'].HTML(12)}</div>
				<span class="checkbox-text"> ${RenderService.renderLeaves(ctx)} </span>
			</div>
		`
	},
	CSS: css`
		.block-checkbox {
			display: flex;
			flex-direction: row;
			align-items: center;
			line-height: var(--ntc-user-p-line-height);
			min-height: var(--ntc-app-sizing-sm);
		}

		.checkbox-input {
			${MIXINS['flex-centered']}
			height: calc(var(--ntc-app-sizing-xs) - 2px);
			width: calc(var(--ntc-app-sizing-xs) - 2px);

			margin: 0 var(--ntc-app-spacing-md);

			border-radius: var(--ntc-app-border-radius-sm);
			border-width: 1px;
			border-style: solid;
			background-color: transparent;
			border-color: var(--ntc-user-checkbox-border-color);
		}

		.checkbox-input svg {
			stroke: white;
		}

		.checkbox-text {
			color: var(--ntc-user-font-color);
		}

		.block-checkbox[aria-checked='true'] .checkbox-input {
			background-color: var(--ntc-user-checkbox-bg-color);
			border-color: transparent;
		}
		.block-checkbox[aria-checked='false'] .checkbox-input svg {
			display: none;
		}

		.block-checkbox[aria-checked='true'] .checkbox-text {
			text-decoration: line-through;
			opacity: 0.666;
		}
	`,
	MARKDOWN: (ctx) => `- [${ctx.block.data.checked ? 'x' : ''}] ${RenderService.renderLeaves(ctx, 'MARKDOWN')}`,
} satisfies RenderComponent<'block'>
