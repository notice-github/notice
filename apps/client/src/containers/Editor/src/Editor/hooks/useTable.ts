import { Transforms } from 'slate'
import { useSlate } from 'slate-react'
import { TableContent } from '../Blocks/Table/Table'

interface IUpdateTableHead {
	event: React.ChangeEvent<HTMLInputElement>
	headIndex: number
	content: TableContent
}

interface IUpdateTableRowCell {
	value: string | null
	cellIndex: number
	rowIndex: number
	content: TableContent
}

const useTable = () => {
	const editor = useSlate()

	/// handle table header cell on change
	const updateTableHead = ({ event, headIndex, content }: IUpdateTableHead) => {
		if (!event?.target) return
		const newCellValue = event.target.value

		let updatedHead = [...content.header.content]

		for (let i = 0; i < updatedHead?.length; i++) {
			for (let j = 0; j < updatedHead[i]?.length; i++) {
				if (i === headIndex) {
					let cells = [...updatedHead[i]]
					cells[j] = { ...cells[j], text: newCellValue }
					updatedHead[i] = [...cells]
				}
			}
		}
		Transforms.setNodes(editor, {
			content: { ...content, header: { content: [...updatedHead] } },
		})
	}

	/// handle table row cell on change
	const updateTableRowCell = ({ value, cellIndex, rowIndex, content }: IUpdateTableRowCell) => {
		if (value === null) return

		let updatedRow = [...content.rows]

		for (let i = 0; i < updatedRow.length; i++) {
			if (i === rowIndex) {
				let arrayToUpdate = { content: [...updatedRow[i].content] }
				for (let j = 0; j < arrayToUpdate.content.length; j++) {
					if (j === cellIndex) {
						for (let z = 0; z < arrayToUpdate.content[j].length; z++) {
							let cells = [...arrayToUpdate.content[j]]
							cells[z] = { ...cells[z], text: value }
							arrayToUpdate.content[j] = [...cells]
							updatedRow[i] = arrayToUpdate
						}
					}
				}
			}
		}

		Transforms.setNodes(editor, {
			content: { ...content, rows: [...updatedRow] },
		})
	}

	// insert a new row
	const insertRow = (content: TableContent, currentIndex: number) => {
		const newCell = []
		const rows = [...content.rows]

		for (let i = 0; i < content.header.content.length; i++) {
			newCell.push([{ text: '' }])
		}

		rows.splice(currentIndex, 0, { content: newCell })

		Transforms.setNodes(editor, {
			content: { ...content, rows },
		})
	}

	// delete a row
	const deleteRow = (content: TableContent, currentIndex: number) => {
		// check with Quentin to see if it's okay to delete a block like this
		if (content.rows.length === 1) {
			Transforms.delete(editor, { unit: 'block' })
		}
		const rows = [...content.rows]
		rows.splice(currentIndex, 1)

		Transforms.setNodes(editor, {
			content: { ...content, rows },
		})
	}

	// insert column
	const insertColumn = (content: TableContent, currentIndex: number) => {
		let newHeader = [...content.header.content]
		newHeader.splice(currentIndex, 0, [{ text: '' }])

		const rows = insertVerticalCells(content, currentIndex)

		Transforms.setNodes(editor, {
			content: { header: { content: newHeader }, rows: [...rows] },
		})
	}

	// loop through cells in rows array
	const insertVerticalCells = (content: TableContent, currentIndex: number) => {
		const updatedRow = content.rows.map((cell) => {
			const cellToUpdate = [...cell.content]
			cellToUpdate.splice(currentIndex, 0, [{ text: '' }])
			return { content: cellToUpdate }
		})

		return updatedRow
	}

	// delete column

	const deleteColumn = (content: TableContent, currentIndex: number) => {
		// check with Quentin to see if it's okay to delete a block like this
		if (content.header.content.length === 1) {
			Transforms.delete(editor, { unit: 'block' })
		}

		let newHeader = [...content.header.content]
		newHeader.splice(currentIndex, 1)

		const rows = deleteVerticalCells(content, currentIndex)

		Transforms.setNodes(editor, {
			content: { header: { content: newHeader }, rows: rows },
		})
	}

	// loop through cells in rows array
	const deleteVerticalCells = (content: TableContent, currentIndex: number) => {
		const updatedRow = content.rows.map((cell) => {
			const updatedCell = [...cell.content]
			updatedCell.splice(currentIndex, 1)
			return { content: [...updatedCell] }
		})

		return updatedRow
	}

	return { insertRow, deleteRow, insertColumn, deleteColumn, updateTableHead, updateTableRowCell }
}

export default useTable
