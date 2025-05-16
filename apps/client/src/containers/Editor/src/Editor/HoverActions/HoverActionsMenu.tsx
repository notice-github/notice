import { cloneElement, ReactElement, useState } from 'react'
import { Element, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import styled from 'styled-components'
import { DuplicateIcon, TrashIcon } from '../../Icons'
import { Menu } from '../Components/Menu'
import { MenuItem } from '../Components/Menu/MenuItem'
import { NTransforms } from '../noticeEditor'

interface ActionsPropsMenuWrapper {
	show: boolean
	setShow: (show: boolean) => void
	element: Element
	extraMenuActions: Array<ReactElement>
}

export const HoveringMainBlockActionsMenu = ({ show, setShow, element, extraMenuActions }: ActionsPropsMenuWrapper) => {
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
	const editor = useSlate()

	const deleteAction = () => {
		setShow(false)

		const path = ReactEditor.findPath(editor, element)

		if (editor.children.length <= 1) {
			Transforms.insertNodes(editor, [{ type: 'paragraph', children: [{ text: '' }] }], { at: path.map((e) => e + 1) })
			Transforms.removeNodes(editor, { at: path })
		} else {
			Transforms.removeNodes(editor, { at: path })
		}
	}

	const duplicateAction = () => {
		setShow(false)

		NTransforms.cloneCurrentNode(editor, element)
	}

	extraMenuActions = extraMenuActions?.map((elem) => {
		if (elem.props.autoClose) {
			return cloneElement(elem, {
				onClick: () => {
					setShow(false)
					if (elem?.props?.onClick) elem.props.onClick()
				},
			})
		} else return elem
	})

	const menuItems: any[] = [
		element.type !== 'page' && (
			<MenuItem
				icon={<DuplicateIcon size={16} />}
				text="Duplicate"
				onClick={duplicateAction}
				name="duplicate"
				key="duplicate"
				id="duplicated-menu-id"
			/>
		),
		element.type !== 'page' && (
			<MenuItem
				icon={<TrashIcon size={16} />}
				text="Delete"
				onClick={deleteAction}
				name="delete"
				key="delete"
				id="delete-menu-id"
			/>
		),
		...extraMenuActions,
	].filter((item) => item)

	return (
		<div>
			<RefElement ref={setReferenceElement}></RefElement>
			{show && (
				<Menu
					closing={!show}
					anchorRef={referenceElement}
					offset={[0, 20]}
					onClose={() => setShow(false)}
					maxHeight={'360px'}
					placement="left"
					simpleMenu
				>
					{menuItems}
				</Menu>
			)}
		</div>
	)
}

const RefElement = styled.div`
	width: 0px;
	height: 0px;
	background-color: transparent;
`
