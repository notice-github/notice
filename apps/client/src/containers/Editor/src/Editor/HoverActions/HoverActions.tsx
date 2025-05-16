import { DragEvent, ReactElement, useEffect, useRef, useState } from 'react'
import { Element, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import styled, { css } from 'styled-components'
import { EditIcon } from '../../Icons'
import { insertDocument } from '../Blocks/Document/Document'
import { insertImage } from '../Blocks/Image/Image'
import { insertVideo } from '../Blocks/Video/Video'
import { useEditorMethods } from '../Contexts/EditorMethods.provider'
import { HoveringMainBlockActionsMenu } from './HoverActionsMenu'
import { cleanGhostDiv, createGhostDiv } from './dndHelpers'
import { HandIcon } from '../../Icons/Hand.icon'
import { disableScroll, enableScroll } from '../SlashMenu/SlashMenuProvider'
import { ReactTooltip } from '../../../../../components/React-Tooltip'

interface Props {
	children: React.ReactElement | React.ReactElement[]
	element: Element
	extraMenuActions: Array<ReactElement>
}

export const HoverActionsWrapper = ({ children, element, extraMenuActions }: Props) => {
	// we need state to force the actions icon to hide on certain events:
	// - if the user starts typing something
	const editor = useSlate()
	const [showActions, setShowActions] = useState(false)
	const [showMainMenu, setShowMainMenu] = useState(false)
	const [draggedOver, setDraggedOver] = useState(false)
	const [, setIsDragging] = useState(false)
	const DISABLE_DROP_FOR = ['list-item', 'check-list-item']
	const { onUploadFile } = useEditorMethods()

	useEffect(() => {
		if (showMainMenu) {
			disableScroll()
		} else {
			enableScroll()
		}
		return () => enableScroll()
	}, [showActions, showMainMenu])

	return (
		// re-show the icon when the users starts to move the mouse
		<HoverContainer
			onMouseEnter={() => {
				!showActions && setShowActions(true)
			}}
			// only hide the icon if the menu is not open
			onMouseLeave={() => !showMainMenu && showActions && setShowActions(false)}
			onDragStart={(e) => {
				const droppedElementPath = ReactEditor.findPath(editor, element)
				e.dataTransfer.setData('droppedElementPath', JSON.stringify({ droppedElementPath: droppedElementPath }))
				const ghost = createGhostDiv()
				e.dataTransfer.setDragImage(ghost, 0, 0)
				e.dataTransfer.setData('droppedElementId', element?.id)
				setIsDragging(true)
			}}
			onDragLeave={() => cleanGhostDiv()}
			onDragEnd={() => cleanGhostDiv()}
		>
			{showActions && (
				<ActionsWrapper
					element={element}
					setShowActions={setShowActions}
					showMainMenu={showMainMenu}
					setShowMainMenu={setShowMainMenu}
					extraMenuActions={extraMenuActions}
				/>
			)}
			<BlockWrapper
				onDragOver={(e: DragEvent<HTMLDivElement>) => {
					if (!DISABLE_DROP_FOR.includes(element.type)) {
						e.preventDefault()
						setDraggedOver(true)
					}
				}}
				onDrop={(e: DragEvent<HTMLDivElement>) => {
					e.preventDefault()
					e.stopPropagation()

					const dataFromOutside = e.dataTransfer
					const files = dataFromOutside.files
					const currentElementPath = ReactEditor.findPath(editor, element)

					// handle file drop from computer
					if (files.length > 0) {
						for (const file of files) {
							const [mime] = file.type.split('/')

							// upload image to back and insert in editor
							if (mime === 'image' && onUploadFile != null) {
								onUploadFile(file, 'image').then((uploadedFile) => {
									insertImage(editor, uploadedFile, currentElementPath)
								})
							}

							if (mime === 'video' && onUploadFile != null) {
								onUploadFile(file, 'video').then((uploadedFile) => {
									insertVideo(editor, uploadedFile, currentElementPath)
								})
							}

							if (mime === 'application' && onUploadFile != null) {
								onUploadFile(file, 'application').then((uploadedFile) => {
									insertDocument(editor, uploadedFile, currentElementPath)
								})
							}
						}
					} else {
						const droppedElementPath = JSON.parse(e.dataTransfer.getData('droppedElementPath')).droppedElementPath

						Transforms.moveNodes(editor, {
							at: droppedElementPath,
							to: currentElementPath,
							voids: true,
						})
					}

					setDraggedOver(false)
					setIsDragging(false)
					cleanGhostDiv()
				}}
				draggedOver={draggedOver}
				onDragLeave={() => {
					cleanGhostDiv()
					setDraggedOver(false)
				}}
				draggable={false}
			>
				{children}
			</BlockWrapper>
		</HoverContainer>
	)
}

const BlockWrapper = styled.div<any>`
	border-top: ${({ draggedOver, theme }) => (draggedOver ? `2px solid ${theme.colors.primary} !important;` : 'none')};
	padding: 0.05px;
`

interface ActionsWrapperProps {
	element: Element
	setShowActions: (showActions: boolean) => void
	showMainMenu: boolean
	setShowMainMenu: (showMainMenu: boolean) => void
	extraMenuActions: Array<ReactElement>
}

export const ActionsWrapper = ({
	element,
	setShowActions,
	showMainMenu,
	setShowMainMenu,
	extraMenuActions,
}: ActionsWrapperProps) => {
	// Handle click outside closing
	useEffect(() => {
		document.addEventListener('keydown', handleKeyboardEvents)
		return () => {
			document.removeEventListener('keydown', handleKeyboardEvents)
		}
	}, [])

	// any keyboard event will force the icons to hide if the menu is not open
	const handleKeyboardEvents = (e: KeyboardEvent) => {
		if (showMainMenu) return
		setShowActions(false)
	}

	const EditWrapper = () => {
		return (
			<>
				<ReactTooltip anchorSelect=".anchor-tooltip-edit-hover" place="top">
					Edit this block
				</ReactTooltip>

				<EditIconWrapper
					className="anchor-tooltip-edit-hover"
					data-tooltip-delay-show={500}
					onMouseDown={(e) => {
						setShowMainMenu(true)
						e.stopPropagation()
						e.preventDefault()
					}}
				>
					<EditIcon color={'#A6B3BF'} size={14} />
				</EditIconWrapper>
			</>
		)
	}

	return (
		<Wrapper element={element} id="actions-wrapper" draggable={true}>
			<ReactTooltip anchorSelect=".anchor-tooltip-dnd-hover" place="top">
				Move this block by holding and dragging
			</ReactTooltip>

			<HandWrapper className="anchor-tooltip-dnd-hover" data-tooltip-delay-show={500}>
				<HandIcon size={16} />
			</HandWrapper>
			<EditWrapper />
			<HoveringMainBlockActionsMenu
				element={element}
				show={showMainMenu}
				setShow={setShowMainMenu}
				extraMenuActions={extraMenuActions}
			/>
		</Wrapper>
	)
}

const HandWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 17px;
	height: 17px;
	padding: 3px;

	border-radius: 3px;

	cursor: grab;
	:hover {
		path {
			stroke: ${({ theme }) => theme.colors.primary} !important;
		}
	}
`

const EditIconWrapper = styled.div<any>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 17px;
	height: 17px;
	padding: 3px;

	border-radius: 3px;
	justify-content: center;

	cursor: pointer;
	:hover {
		path {
			stroke: ${({ theme }) => theme.colors.primary} !important;
		}
	}
`

const Wrapper = styled.div<{ element: Element }>`
	z-index: 9999;
	position: absolute;
	gap: 0px;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	padding: 0px 0px 8px 14px;

	left: -36px;

	width: auto;
	/* adapt to the type of element */
	height: auto;
	/* but stop after a certain height so it's always top-left */

	max-height: 55px;
	cursor:none {
		display: none !important;
	}

	:hover {
	}

	// align this container based on the element type as they
	// have different height, padding and margin around them
	${({ element }) => {
		switch (element?.type) {
			case 'table':
			case 'header-1':
				return css`
					top: 15px;
				`
			case 'header-2':
				return css`
					top: 10px;
				`
			case 'expandable':
				return css`
					top: 13px;
				`
			case 'check-list-item':
				return css`
					top: var(--ntc-user-block-padding);
				`
			case 'divider':
				return css`
					top: -5px;
				`
			default:
				return css`
					top: calc(var(--ntc-user-block-padding) + 2px);
				`
		}
	}}
`

const HoverContainer = styled.div`
	/* necessary for hover to trigger on the sides */
	position: relative;
	padding-left: 30px;
	z-index: 1;

	#actions-wrapper {
		display: none;
	}

	/* box-sizing: border-box; */
	:hover {
		#actions-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
`
