import { ReactNode, useRef } from 'react'
import { Editor, Element, Range } from 'slate'
import { RenderElementProps } from 'slate-react'
import styled, { css } from 'styled-components'
import { TableRowsModalProvider } from '../../Providers/TableRowsModal'
import { useHorizontalScrollShadow } from '../../hooks/useHorizontalScrollShadow'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'
import TableHeader from './TableHeader'
import TableRows from './TableRows'

export type TableHeaderType = { content: Array<TableCellType> }
export type TableRowsType = Array<{ content: Array<TableCellType> }>
export type TableCellType = CustomText[]

export type TableContent = { header: TableHeaderType; rows: TableRowsType }

export interface TableBlock {
	type: 'table'
	children: CustomText[]
	id?: string
	content: TableContent
}

interface TableProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: TableBlock
}

export const withTables = (editor: Editor) => {
	const { isVoid, deleteBackward } = editor

	editor.deleteBackward = (unit) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const [cell] = Editor.nodes(editor, {
				match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
			})
			if (cell) return
		}

		deleteBackward(unit)
	}

	editor.isVoid = (element) => {
		return element.type === 'table' ? true : isVoid(element)
	}

	return editor
}

const Table = ({ children, attributes, element }: TableProps) => {
	const { content, id } = element
	const ref = useRef<HTMLDivElement>(null)
	const [showStart, showEnd] = useHorizontalScrollShadow(ref, content.header?.content)

	return (
		<TableRowsModalProvider>
			<Wrapper showEnd={showEnd} showStart={showStart} {...attributes} contentEditable={false}>
				<Container ref={ref}>
					<StyledTable isOverFlowing={content.header?.content.length > 3}>
						<TableHeader content={content} id={id}></TableHeader>
						<TableRows content={content} id={id}></TableRows>
					</StyledTable>
					<div style={{ display: 'none' }} contentEditable={false}>
						{children}
					</div>
				</Container>
			</Wrapper>
		</TableRowsModalProvider>
	)
}

export const insertNewTable = (editor: Editor) => {
	const defaultData: TableBlock = {
		type: 'table',
		children: [{ text: '' }],
		content: {
			header: {
				content: [[{ text: 'Untitled Column 1' }], [{ text: 'Untitled Column 2' }], [{ text: 'Untitled Column 3' }]],
			},
			rows: [
				{ content: [[{ text: '' }], [{ text: '' }], [{ text: '' }]] },
				{ content: [[{ text: '' }], [{ text: '' }], [{ text: '' }]] },
			],
		},
	}

	NTransforms.insertNodeCurrent(editor, defaultData)
}

const Wrapper = styled.div<{ showStart: boolean; showEnd: boolean }>`
	width: 100%;
	position: relative;
	margin: 8px 0;
	${(props) =>
		props.showStart
			? css`
					::before {
						content: '';
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						width: 12px;
						z-index: 2;
						background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.13));
					}
			  `
			: undefined}
	${(props) =>
		props.showEnd
			? css`
					::after {
						content: '';
						position: absolute;
						top: 0;
						bottom: 0;
						right: 0;
						width: 12px;
						background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.13));
					}
			  `
			: undefined}
`

const Container = styled.div`
	width: 100%;
	height: 100%;
	overflow: auto;
	margin: var(--ntc-user-block-padding) 0;
`

const StyledTable = styled.table<{ isOverFlowing: boolean }>`
	width: 100%;
	height: 100%;
	table-layout: ${({ isOverFlowing }) => (isOverFlowing ? 'auto' : 'fixed')};

	border-collapse: collapse;
	box-sizing: border-box;
`

export default Table
