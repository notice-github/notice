import { CustomText } from '../../types'
import { TableBlock } from './Table'
type CellData = { text: string }
type RowData = { content: Array<CellData> }
type TableContent = Array<RowData>

export interface OldTableBlock {
	type: 'table'
	children: CustomText[]
	id?: string
	content: TableContent
}

export const tableMigration = (oldData: OldTableBlock) => {
	let newTableData: TableBlock = {
		type: 'table',
		children: [{ text: '' }],
		content: {
			header: { content: [] },
			rows: [],
		},
	}

	let y = 0

	// handle headers
	for (let i = 0; i < oldData.content.length; i++) {
		if (i === 0) {
			for (let j = 0; j < oldData.content[i].content.length; j++) {
				newTableData.content.header.content.push([{ text: oldData.content[i].content[j].text }])
			}
		}
	}

	//handle rows
	for (let i = 1; i < oldData.content.length; i++) {
		newTableData.content.rows.push({ content: [] })
		for (let j = 0; j < oldData.content[i].content.length; j++) {
			newTableData.content.rows[y].content.push([{ text: oldData.content[i].content[j].text }])
		}
		y++
	}

	return newTableData
}
