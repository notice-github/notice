import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ArrowLeft, ArrowRight, TrashIcon } from '../../../Icons'

import { Modal } from '../../Components/Modal/Modal'
import { useTableRowsModalState } from '../../Providers/TableRowsModal'
import useTable from '../../hooks/useTable'
import { TableCellType, TableContent } from './Table'

interface IProps {
	content: TableContent
	activeIndex: number
	id?: string
}

const RowsModal = ({ id, content, activeIndex }: IProps) => {
	const { opened, setOpened } = useTableRowsModalState()
	const { deleteRow } = useTable()
	const [currentCell, setCurrentCell] = useState(1)

	const theme = useTheme()

	useEffect(() => {
		setCurrentCell(activeIndex + 1)
	}, [activeIndex])

	const { rows } = content

	const IndexOfLastCell = currentCell * 1
	const IndexOfFirstCell = IndexOfLastCell - 1
	const CurrentCells = rows.slice(IndexOfFirstCell, IndexOfLastCell)

	const nCells = Math.ceil(rows.length / 1)

	const nextCell = () => {
		if (currentCell !== nCells) setCurrentCell((curr) => curr + 1)
	}
	const prevCell = () => {
		if (currentCell !== 1) setCurrentCell((curr) => curr - 1)
	}

	const deleteRowAndClose = () => {
		deleteRow(content, activeIndex)
		setOpened(false)
	}

	if (!opened) return null

	return (
		<Modal open={opened} setOpen={setOpened}>
			<Wrapper>
				<Title>Edit Rows</Title>
				<StyledContent>
					{CurrentCells.map((cells, index) => {
						return (
							<StyledCell
								key={`modal-cells-${id}-${index}`}
								cells={cells}
								rowIndex={currentCell - 1}
								content={content}
							/>
						)
					})}
				</StyledContent>
				<SpacedOutDiv>
					<StyledButton onClick={deleteRowAndClose}>
						<TrashIcon size={16} color={theme.colors.textGrey} />
						<span>Delete Row</span>
					</StyledButton>
					<FlexRow>
						<IconContainer isDisabled={currentCell === 1} onClick={prevCell}>
							<ArrowLeft color={theme.colors.textGrey} />
						</IconContainer>
						<CellsOf>
							{currentCell} of {nCells}
						</CellsOf>
						<IconContainer isDisabled={currentCell === rows.length} onClick={nextCell}>
							<ArrowRight color={theme.colors.textGrey} />
						</IconContainer>
					</FlexRow>
				</SpacedOutDiv>
			</Wrapper>
		</Modal>
	)
}

type StyledCell = {
	cells: { content: TableCellType[] }
	content: TableContent
	rowIndex: number
	id?: string
}

const StyledCell = ({ id, cells, content, rowIndex }: StyledCell) => {
	const { updateTableRowCell } = useTable()
	return (
		<>
			{cells.content.map((cell, index) =>
				cell.map((cell) => {
					return (
						<div key={`modal-${id}-cell-${index}`}>
							<p>Text</p>
							<StyledEditable
								onBlur={(e) => {
									updateTableRowCell({
										value: e.currentTarget.textContent,
										rowIndex: rowIndex,
										cellIndex: index,
										content,
									})
								}}
								contentEditable
								suppressContentEditableWarning={true}
							>
								{cell.text}
							</StyledEditable>
						</div>
					)
				})
			)}
		</>
	)
}

const Wrapper = styled.div`
	padding: 40px;
	width: 680px;
	height: auto;

	box-sizing: border-box;
`

const Title = styled.div`
	font-size: 24px;
	font-weight: 700;
	line-height: 24px;
`

const StyledContent = styled.div`
	margin: 24px 0;
	max-height: 487px;
	overflow-y: auto;
	box-sizing: border-box;
`

const SpacedOutDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-left: auto;
	gap: 8px;
	user-select: none;
`

const StyledButton = styled.button`
	display: flex;
	flex-direction: row;
	padding: 8px 12px;
	border-radius: 4px;
	gap: 4px;

	align-items: center;
	justify-content: center;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	background: transparent;
	color: ${({ theme }) => theme.colors.textGrey};
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.hover};
	}
`

const IconContainer = styled.div<{ isDisabled: boolean }>`
	height: 32px;
	width: 32px;

	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 4px;

	opacity: ${({ isDisabled }) => (isDisabled ? '0.3' : '1')};
	pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.hover};
	}
`

const CellsOf = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const StyledEditable = styled.div`
	padding: 8px 16px;
	width: 100%;
	height: 100%;
	overflow-wrap: break-word;

	border-radius: 4px;
	padding: 8px 16px;
	border: ${({ theme }) => `1px solid ${theme.colors.borderLight}`};
	box-sizing: border-box;
	margin-bottom: 8px;

	line-height: 24px;
	font-size: 16px;
	font-weight: 400;
	min-height: 42px;

	outline: 0px solid transparent;
`

export default RowsModal
