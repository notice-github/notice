import { RenderService } from '@root/services/render.service'
import { RenderComponent, css, html } from '@root/system'

const ICONS: { [key: string]: string } = {
	info: '📘',
	warning: '⚠️',
	danger: '🚫',
	tip: '🌱',
}

export const HINT_BLOCK = {
	NAME: 'hint' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const type = data.type?.toLowerCase() ?? 'info'

		return html`
			<div id="${_id}" class="block-hint hint-${type}">
				<div class="hint-icon">${ICONS[type]}</div>
				<div class="hint-content">${RenderService.renderLeaves(ctx)}</div>
			</div>
		`
	},
	MARKDOWN: (ctx) => RenderService.renderLeaves(ctx, 'MARKDOWN'),
	CSS: css`
		.block-hint {
			box-sizing: border-box;
			display: flex;
			align-items: baseline;

			gap: var(--ntc-app-spacing-sm);

			padding: var(--ntc-app-spacing-xl) 0;
			margin: var(--ntc-app-spacing-md) 0;

			background-color: var(--ntc-light-bg-color);

			border-left: 4px solid #000;
			border-radius: var(--ntc-app-border-radius-sm);
		}

		.hint-info {
			border-color: #00569d;
		}
		.hint-warning {
			border-color: #f1c40f;
		}
		.hint-danger {
			border-color: #e74c3c;
		}
		.hint-tip {
			border-color: #07bc0c;
		}

		.hint-icon {
			margin-left: var(--ntc-app-spacing-xl);
			margin-right: var(--ntc-app-spacing-md);
		}

		.hint-content {
			margin-top: var(--ntc-app-spacing-xs);
			padding-right: var(--ntc-app-spacing-xl);

			line-height: var(--ntc-user-p-line-height);

			cursor: text;
			width: 100%;
		}
	`,
} satisfies RenderComponent<'block'>
