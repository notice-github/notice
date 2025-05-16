import { RenderComponent, css, html } from '@root/system.js'
import { ICONS } from '../icons'

export const ANCHOR_DROP_DOWN_MODULE = {
	NAME: 'anchor-drop-down' as const,
	HTML: () => {
		return html`
			<div class="anchor_drop_down" id="anchor_drop_down">
				<p class="selected_anchor">on this page</p>
				<div class="icon_wrapper">${ICONS['chevron-down'].HTML(16)}</div>
			</div>
		`
	},
	CSS: css`
		.anchor_drop_down {
			cursor: pointer;

			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 8px;

			padding: 12px;
			border: 1px solid var(--ntc-light-bg-color);
			border-radius: 6px;

			width: 100%;

			user-select: none;
		}

		.selected_anchor {
			font-size: 1em;
			font-weight: 400;
			width: 100%;
			margin: 0;

			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.icon_wrapper {
			width: 24px;
			height: 24px;

			display: flex;
			align-items: center;
			justify-content: center;
		}
	`,
} satisfies RenderComponent<'module'>
