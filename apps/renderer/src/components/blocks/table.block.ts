import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'

type Cell = { text: string }[]

export const TABLE_BLOCK = {
	NAME: 'table' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { header, rows } = data.content

		if (!header?.content || !rows) return ''

		const layout = header.content.length > 3 ? 'auto-layout' : 'fixed-layout'

		return html`
			<div class="block-table">
				<table id="${_id}" class="table table-${layout}">
					<thead>
						<tr class="table-header">
							${header.content.map((leaves: Cell) => renderHeaderCell(leaves)).join('')}
						</tr>
					</thead>
					<tbody>
						${rows.map((row: { content: Cell[] }) => renderRow(row.content)).join('')}
					</tbody>
				</table>
			</div>
		`
	},
	CSS: css`
		.block-table {
			position: relative;
			overflow: auto;
			margin: var(--ntc-app-spacing-xs) 0;

			width: 100%;
			height: fit-content;
		}

		.table {
			width: 100%;
			box-sizing: border-box;
			border-collapse: collapse;
		}

		.table-auto-layout {
			table-layout: auto;
		}

		.table-fixed-layout {
			table-layout: fixed;
		}

		.table-header-cell {
			padding: var(--ntc-app-spacing-lg) var(--ntc-app-spacing-xl);
			min-width: var(--ntc-app-sizing-2xl);

			text-align: start;
			border: none;
			background-color: var(--ntc-light-bg-color);
			border-bottom: 1px solid var(--ntc-user-border-color);
			word-break: break-all;
		}

		.table-header-cell:not(:first-child) {
			border-left: 1px solid var(--ntc-user-border-color);
		}

		.table-header-cell:not(:last-child) {
			border-right: 1px solid var(--ntc-user-border-color);
		}

		.table-row {
			border-bottom: 1px solid var(--ntc-user-border-color);
		}

		.table-cell {
			overflow-wrap: anywhere;

			vertical-align: middle;
			padding: var(--ntc-app-spacing-md) var(--ntc-app-spacing-xl);

			height: calc(var(--ntc-app-sizing-md) - 2px);
			min-width: var(--ntc-app-sizing-2xl);

			margin: 0;
			border: none;
			color: var(--NTCVAR-user-main-font-color);
		}

		.table-cell:not(:first-child) {
			border-left: 1px solid var(--ntc-user-border-color);
		}

		.table-cell:not(:last-child) {
			border-right: 1px solid var(--ntc-user-border-color);
		}
	`,
	// Markdown is possible for tables, but extremely difficult to create as plain text, maybe later
	// https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables
} satisfies RenderComponent<'block'>

//-------------------//
// Helpers Functions //
//-------------------//

const renderHeaderCell = (leaves: Cell) => {
	return html`<th class="table-header-cell">
		<span>${Helpers.leavesToText(leaves)}</span>
	</th>`
}

const renderCell = (leaves: Cell) => {
	return html`<td class="table-cell">
		<span>${Helpers.leavesToText(leaves)}</span>
	</td>`
}

const renderRow = (row: Cell[]) => {
	return html`<tr class="table-row">
		${row.map((cell) => renderCell(cell)).join('')}
	</tr>`
}
