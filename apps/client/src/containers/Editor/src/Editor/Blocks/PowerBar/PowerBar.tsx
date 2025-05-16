import { ReactNode } from 'react'
import { Editor, Transforms, Element, Path } from 'slate'
import { ReactEditor, RenderElementProps } from 'slate-react'

import styled from 'styled-components'
import { Checkbox } from '../../Components/Checkbox/Checkbox.component'
import { MenuItem } from '../../Components/Menu/MenuItem'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { NTransforms } from '../../noticeEditor'
import { CustomText } from '../../types'

export interface PowerBarBlock {
	type: 'power-bar'
	children: CustomText[]
	exportToPdf?: boolean
	shareToLinkedin?: boolean
	id?: string
}

interface PowerBarProps {
	children: ReactNode
	attributes: RenderElementProps['attributes']
	element: PowerBarBlock
}

export const PowerBar = ({ attributes, children, element }: PowerBarProps) => {
	const { exportToPdf = true, shareToLinkedin = true } = element

	return (
		<FlexColumnContainer {...attributes} contentEditable={false}>
			<SpacedFlexContainer smallContainer={false}>
				<FlexRowContainer smallContainer={false}></FlexRowContainer>
				<FlexBaseLine>{exportToPdf && <CenteredIconContainer>📄</CenteredIconContainer>}</FlexBaseLine>
				<FlexBaseLine>{shareToLinkedin && <CenteredIconContainer>🔗</CenteredIconContainer>}</FlexBaseLine>
			</SpacedFlexContainer>
			<div contentEditable={false} style={{ height: 0, pointerEvents: 'none' }} tabIndex={-1}>
				{children}
			</div>
		</FlexColumnContainer>
	)
}

const FlexColumnContainer = styled.div`
display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 700px;
    width: 100%;
    margin: auto;
`

const SpacedFlexContainer = styled.div<{ smallContainer: boolean }>`
    width: 100%;
    display: flex;
    justify-content: ${(props) => (props.smallContainer ? 'center' : 'space-between')};
    align-items: center;
    flex-direction: ${(props) => (props.smallContainer ? 'column' : 'row')};
    word-wrap: break-word;

    gap: 4px;
`

const FlexRowContainer = styled.div<{ smallContainer: boolean }>`
   width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: ${(props) => (props.smallContainer ? '100%' : 'calc(100% - 100px - 16px)')};
    gap: 10px;
`

const FlexBaseLine = styled.div`
    display: flex;
    justify-content: baseline;
    gap: 6px;

    svg {
    fill: var(--NTCVAR-user-main-font-color);
}
`

const CenteredIconContainer = styled.div`
    display: flex;
    border-radius: 8px;
    background-color: transparent;

    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    height: 40px;
    width: 40px;
    cursor: not-allowed;
	* {
		cursor: not-allowed;

	}
    transition: box-shadow 250ms;

    &:hover {
    	background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`
const Centered = styled.div`
    width: 60;   
    height: 40;
    display: flex;
    align-items: center;
    justify-content: center;
`

export const withPowerBar = (editor: Editor) => {
	const { normalizeNode } = editor

	editor.normalizeNode = (entry) => {
		const [current] = Editor.nodes(editor, {
			voids: true,
			match: (n) => {
				return !Editor.isEditor(n) && Element.isElement(n) && n.type === 'power-bar'
			},
		})
		if (current) {
			Transforms.select(editor, Path.next(current[1]))
			return
		}
		normalizeNode(entry)
	}

	return editor
}

export const insertPowerBar = (editor: Editor) => {
	NTransforms.insertNodeCurrent(editor, {
		type: 'power-bar',
		children: [{ text: '' }],
		exportToPdf: true,
		shareToLinkedin: true,
	})
}

export const powerBarMenuActions = (editor: Editor, element: Element): JSX.Element[] => [
	<MenuSeparator key={'divider'} />,
	<MenuItem
		icon={<Checkbox type="checkbox" checked={element?.exportToPdf} onChange={() => null} />}
		text="Export to PDF"
		onClick={() => {
			if (element) {
				const path = ReactEditor.findPath(editor, element)
				Transforms.setNodes(editor, { exportToPdf: !element?.exportToPdf }, { at: path })
			}
		}}
		name="exportToPdf"
		key="exportToPdf"
	/>,
	<MenuItem
		icon={<Checkbox type="checkbox" checked={element?.shareToLinkedin} onChange={() => null} />}
		text="Share to Linkedin"
		onClick={() => {
			if (element) {
				const path = ReactEditor.findPath(editor, element)
				Transforms.setNodes(editor, { shareToLinkedin: !element?.shareToLinkedin }, { at: path })
			}
		}}
		name="shareToLinkedin"
		key="shareToLinkedin"
	/>,
]
