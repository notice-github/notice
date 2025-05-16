import styled from 'styled-components'

import { useTableRowsModalState } from '../../Providers/TableRowsModal'
import RowsModal from './RowsModal'
import { TableContent } from './Table'
import { TableCells } from './TableCells'

interface IProps {
	content: TableContent
	id?: string
}

const TableRows = ({ content, id }: IProps) => {
	const { activeIndex } = useTableRowsModalState()
	return (
		<tbody>
			{content.rows.map((row, rowIndex) => (
				<StyledRow key={`row-${id}-${rowIndex}`}>
					{row.content?.map((cell, index) => (
						<TableCells
							key={`cells-${id}-${rowIndex}-${index}`}
							content={content}
							cells={row.content}
							cell={cell}
							id={id}
							rowIndex={rowIndex}
							cellIndex={index}
						></TableCells>
					))}
				</StyledRow>
			))}
			<RowsModal id={id} activeIndex={activeIndex} content={content} />
		</tbody>
	)
}

const StyledRow = styled.tr``

export default TableRows
