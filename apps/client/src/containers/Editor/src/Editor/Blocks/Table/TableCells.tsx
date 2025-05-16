import { lighten } from 'polished'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getCssVariableValue } from '../../../../../../utils/CSS'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'
import { useIsHovered } from '../../hooks/useIsHovered'
import useTable from '../../hooks/useTable'
import { RowMenuButton } from './RowMenu'
import { TableCellType, TableContent } from './Table'

interface ITableCellsProps {
	id?: string
	cell: TableCellType
	cells: Array<TableCellType>
	rowIndex: number
	cellIndex: number
	content: TableContent
}

export const TableCells = ({ id, cells, cell, cellIndex, content, rowIndex }: ITableCellsProps) => {
	return (
		<>
			{cell.map((customText, index) => (
				<TableRowCell
					key={`cell-${id}-${cellIndex}-${index}`}
					cells={cells}
					cell={cell}
					id={id}
					value={customText.text}
					content={content}
					cellIndex={cellIndex}
					rowIndex={rowIndex}
					customTextIndex={index}
				></TableRowCell>
			))}
		</>
	)
}

interface ITableRowCell {
	id?: string
	content: TableContent
	customTextIndex: number
	rowIndex: number
	value: string
	cellIndex: number
	cell: TableCellType
	cells: Array<TableCellType>
}

const TableRowCell = ({ id, content, customTextIndex, cellIndex, rowIndex, cell, cells }: ITableRowCell) => {
	const [referenceElement, setReferenceElement] = useState<HTMLTableCellElement | null>(null)
	const headHovered = useIsHovered([referenceElement]).some(Boolean)
	const [menuOpened, setMenuOpened] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [cursor, setCursor] = useState<number | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const { updateTableRowCell } = useTable()
	const [, copy] = useCopyToClipboard()

	// have a controlled cursor as the cursor keeps on jumping
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.setSelectionRange(cursor, cursor)
		}
	}, [inputRef, cursor, cell, customTextIndex])

	// handle focus on arrow key press using index right and left for inner array , up and down outer array
	// bit of a hack which wil be handled when we use the editable from slate
	const handleKeyPressed = (e: React.KeyboardEvent<HTMLInputElement>, cellIndex: number, rowIndex: number) => {
		const target = e.target as HTMLInputElement
		e.stopPropagation()

		if (e.key === 'ArrowRight' && target.selectionEnd === target.value.length) {
			const nextField = document?.querySelector(`input[name=text-${id}-${rowIndex}-${cellIndex + 1}]`)
			if (nextField !== null) return (nextField as HTMLElement).focus()
		} else if (e.key === 'ArrowLeft' && target.selectionStart === 0) {
			const prevField = document?.querySelector(`input[name=text-${id}-${rowIndex}-${cellIndex - 1}]`)
			if (prevField !== null) return (prevField as HTMLElement).focus()
		} else if (e.key === 'ArrowUp') {
			const prevField = document?.querySelector(`input[name=text-${id}-${rowIndex - 1}-${cellIndex}]`)
			if (prevField !== null) return (prevField as HTMLElement).focus()
		} else if (e.key === 'ArrowDown' || e.key === 'Enter') {
			const prevField = document?.querySelector(`input[name=text-${id}-${rowIndex + 1}-${cellIndex}]`)
			if (prevField !== null) return (prevField as HTMLElement).focus()
		}
	}

	return (
		<StyledCell tabIndex={1} focused={isFocused} ref={setReferenceElement} lastElement={cells.length - 1 === cellIndex}>
			<Wrapper focused={isFocused}>
				<FlexRow>
					<StyledInput
						ref={inputRef}
						onKeyDown={(e) => handleKeyPressed(e, cellIndex, rowIndex)}
						spellCheck={false}
						//handle cut,copy & paste manually
						onCut={(e) => {
							e.stopPropagation()
							copy(e.currentTarget.value)
							updateTableRowCell({ value: '', rowIndex, cellIndex, content })
						}}
						onCopy={(e) => copy(e.currentTarget.value)}
						onPaste={(e) => {
							updateTableRowCell({ value: e.clipboardData.getData('text/plain'), rowIndex, cellIndex, content })
							setCursor(e.clipboardData.getData('text/plain').length)
						}}
						key={`text-${id}-${rowIndex}-${cellIndex}`}
						name={`text-${id}-${rowIndex}-${cellIndex}`}
						onFocus={(e) => {
							setIsFocused(true)
							setCursor(e.currentTarget.value.length)
						}}
						onBlur={() => setIsFocused(false)}
						onChange={(e) => {
							setCursor(e.target.selectionStart)
							updateTableRowCell({ value: e.target.value, rowIndex, cellIndex, content })
						}}
						value={cell[customTextIndex].text}
					/>
					{((headHovered && cellIndex === 0) || menuOpened) && (
						<RowMenuButton
							currentIndex={rowIndex}
							content={content}
							setMenuOpened={setMenuOpened}
							menuOpened={menuOpened}
						/>
					)}
				</FlexRow>
			</Wrapper>
		</StyledCell>
	)
}

const StyledCell = styled.td<{ lastElement: boolean; focused: boolean }>`
	position: relative;
	vertical-align: middle;
	height: inherit;

	min-width: 200px;
	width: 100%;
	margin: 0;
	border-bottom: 1px solid
		${({ theme }) => lighten(0.3, getCssVariableValue('ntc-user-font-color') || theme.colors.border)};
	border-right: ${({ lastElement, focused, theme }) =>
		lastElement || focused
			? undefined
			: `1px solid ${lighten(0.3, getCssVariableValue('ntc-user-font-color') || theme.colors.border)}`};
`

const Wrapper = styled.div<{ focused: boolean }>`
	height: 100%;

	display: flex;
	align-items: center;
	justify-content: flex-start;

	border: ${({ focused, theme }) => (focused ? `1px solid ${theme.colors.primary}` : '1px solid transparent')};
`

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;

	align-items: center;
	justify-content: space-between;

	padding: 8px 16px;
`

const StyledInput = styled.input`
	border: none;
	outline: none;
	box-sizing: border-box;
	padding: 0;
	margin: 0;
	resize: none;

	width: 100%;
	height: 100%;

	padding-left: 16px;

	font-family: sans-serif;
	font-size: 16px;

	background: transparent;
	color: var(--ntc-user-font-color);
`

export default TableCells
