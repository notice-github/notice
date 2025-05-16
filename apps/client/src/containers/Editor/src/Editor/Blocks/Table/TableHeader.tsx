import { lighten } from 'polished'
import { useState } from 'react'
import styled from 'styled-components'
import { getCssVariableValue } from '../../../../../../utils/CSS'
import { useIsHovered } from '../../hooks/useIsHovered'
import useTable from '../../hooks/useTable'
import { HeaderMenuButton } from './HeaderMenu'
import { TableContent } from './Table'

interface IProps {
	content: TableContent
	id?: string
}

const TableHeader = ({ id, content }: IProps) => {
	return (
		<TableHead>
			<tr style={{ border: 'none' }}>
				{content.header?.content?.map((headerCell, index) =>
					headerCell.map((value, cellIndex) => (
						<TableHeaderCell
							key={`header-${id}-${index}-${cellIndex}`}
							value={value.text}
							content={content}
							headIndex={index}
						></TableHeaderCell>
					))
				)}
			</tr>
		</TableHead>
	)
}

interface ITableHeaderCell {
	content: TableContent
	headIndex: number
	value: string
}

const TableHeaderCell = ({ content, headIndex, value }: ITableHeaderCell) => {
	const [menuOpened, setMenuOpened] = useState(false)
	const { updateTableHead } = useTable()

	const [referenceElement, setReferenceElement] = useState<HTMLTableHeaderCellElement | null>(null)
	const headHovered = useIsHovered([referenceElement]).some(Boolean)

	return (
		<StyledTh ref={setReferenceElement} lastElement={content.header.content.length - 1 === headIndex}>
			<FlexRow>
				<StyledInput
					placeholder="Text"
					name="text"
					onChange={(e) => {
						updateTableHead({ event: e, headIndex: headIndex, content })
					}}
					value={value}
				/>
				{(headHovered || menuOpened) && (
					<HeaderMenuButton
						content={content}
						currentIndex={headIndex}
						setMenuOpened={setMenuOpened}
						menuOpened={menuOpened}
					/>
				)}
			</FlexRow>
		</StyledTh>
	)
}

const StyledInput = styled.input`
	border: none;
	outline: none;
	box-sizing: border-box;
	padding: 0;
	margin: 0;

	width: 100%;
	height: 100%;

	padding-right: 4px;
	font-family: sans-serif;
	background: transparent;

	font-size: 16px;
	line-height: 24px;
	font-weight: 500;
	color: var(--ntc-user-font-color);
	--placeholderTextColor: #7c8790;
`

const StyledTh = styled.th<{ lastElement: boolean }>`
	position: relative;
	padding: 12px 16px;
	min-width: 200px;
	background-color: ${({ theme }) => lighten(0.5, getCssVariableValue('ntc-user-font-color') || theme.colors.border)};

	border-bottom: 1px solid
		${({ theme }) => lighten(0.3, getCssVariableValue('ntc-user-font-color') || theme.colors.border)};
	border-right: ${({ lastElement, theme }) =>
		lastElement
			? undefined
			: `1px solid ${lighten(0.3, getCssVariableValue('ntc-user-font-color') || theme.colors.border)}`};
`

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const TableHead = styled.thead`
	box-sizing: border-box;
`

export default TableHeader
