// libs
import { useEffect, useState } from 'react'
import { Editor, Range, Transforms } from 'slate'
import { useSlate, useSlateSelection } from 'slate-react'
import styled from 'styled-components'

// helpers
import { isBold, toggleBold } from '../Leaves/Bold.leaf'
import { isCode, toggleCode } from '../Leaves/Code.leaf'
import { isItalic, toggleItalic } from '../Leaves/Italic.leaf'
import { isLink } from '../Leaves/Link.leaf'
import { isStrikethrough, toggleStrikethrough } from '../Leaves/Strikethrough.leaf'
import { isUnderlined, toggleUnderline } from '../Leaves/Underline.leaf'

// components
import { Portal } from '../Components/Portal'

// icons
import { customTheme } from '../../../../../styles'
import { NoticeAIIcon } from '../../Icons'
import { Loader } from '../Components/Loader/Loader'
import { useNoticeEditorContext } from '../Contexts/NoticeEditor.provider'
import { useListenForOutsideClicks } from '../hooks/useListenForOutsideClicks'
import { HoveringAIMenu } from './HoveringAIMenu'
import { HoveringColorMenu } from './HoveringColorMenu'
import { HoveringLinkInput } from './HoveringLinkInput'
import { BoldIcon } from './Icons/BoldIcon'
import { CodeIcon } from './Icons/CodeIcon'
import { ColorIcon } from './Icons/ColorIcon'
import { ItalicIcon } from './Icons/ItalicIcon'
import { LinkIcon } from './Icons/LinkIcon'
import { StrikedThroughIcon } from './Icons/StrikedThroughIcon'
import { UnderlineIcon } from './Icons/UnderlineIcon'

export const HoveringToolbar = () => {
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const editor = useSlate()
	const selection = useSlateSelection()
	const [showColorPicker, setShowColorPicker] = useState(false)
	const [showNoticeAIInline, setShowNoticeAIInline] = useState(false)
	const [showLinkInput, setShowLinkInput] = useState(false)
	const [AIIsLoading, setAIIsLoading] = useState(false)
	const { readOnly, editOnly } = useNoticeEditorContext()

	useListenForOutsideClicks([ref, null], () => ref!.removeAttribute('style'))

	useEffect(() => {
		if (!ref) {
			return
		}

		if (!selection || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
			ref.removeAttribute('style')
			return
		}

		const domSelection = window.getSelection()

		if (!domSelection) return

		// TODO: fails sometimes, find why
		try {
			const domRange = domSelection.getRangeAt(0)

			const rect = domRange.getBoundingClientRect()
			// do not change the position, the getBoundingClientRect() is not working
			if (rect.top === 0 && rect.left === 0) return
			ref.style.opacity = '1'
			ref.style.top = `${rect.top + window.pageYOffset - ref.offsetHeight}px`
			ref.style.left = `${rect.left + window.pageXOffset - ref.offsetWidth / 2 + rect.width / 2}px`
			ref.style.zIndex = `${customTheme.zIndex.hoveringBars}`
		} catch (e) {
			console.error('Hovering toolbar failed to position itself\n')
			console.error(e)
		}
	})

	return (
		<Portal>
			<StyledMenu
				ref={setRef}
				// @ts-ignore
				onMouseDown={(e) => {
					// prevent toolbar from taking focus away from editor
					e.preventDefault()
				}}
				onBlur={() => ref && ref.removeAttribute('style')}
			>
				<ToolbarButton
					onClick={(e) => {
						e.stopPropagation()
						toggleBold(editor)
						Transforms.deselect(editor) // remove the hovering menu be deselecting the selection
					}}
					active={isBold(editor)}
				>
					<BoldIcon />
				</ToolbarButton>
				<ToolbarButton
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						toggleItalic(editor)
						Transforms.deselect(editor)
					}}
					active={isItalic(editor)}
				>
					<ItalicIcon />
				</ToolbarButton>
				<ToolbarButton
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						toggleUnderline(editor)
						Transforms.deselect(editor)
					}}
					active={isUnderlined(editor)}
				>
					<UnderlineIcon />
				</ToolbarButton>
				<ToolbarButton
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						toggleStrikethrough(editor)
						Transforms.deselect(editor)
					}}
					active={isStrikethrough(editor)}
				>
					<StrikedThroughIcon />
				</ToolbarButton>
				<ToolbarButton active={isLink(editor)}>
					<ClickableWrapper
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setShowLinkInput(true)
						}}
					>
						<LinkIcon />
					</ClickableWrapper>
					<HoveringLinkInput
						closeHoveringMenu={() => {
							setShowLinkInput(false)
							Transforms.deselect(editor) // remove the hovering menu be deselecting the selection
						}}
						show={showLinkInput}
						setShow={setShowLinkInput}
					/>
				</ToolbarButton>
				<ToolbarButton
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						toggleCode(editor)
						Transforms.deselect(editor)
					}}
					active={isCode(editor)}
				>
					<CodeIcon />
				</ToolbarButton>
				<ToolbarButton>
					<ClickableWrapper
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setShowColorPicker(true)
						}}
					>
						<ColorIcon />
					</ClickableWrapper>
					<HoveringColorMenu
						onClick={() => {
							Transforms.deselect(editor)
							setShowColorPicker(false)
						}}
						show={showColorPicker}
						setShow={setShowColorPicker}
					/>
				</ToolbarButton>
				{!readOnly && !editOnly && (
					<ToolbarButton>
						{AIIsLoading ? (
							<Loader />
						) : (
							<ClickableWrapper
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									setShowNoticeAIInline(true)
								}}
							>
								<NoticeAIIcon />
							</ClickableWrapper>
						)}
						<HoveringAIMenu show={showNoticeAIInline} setShow={setShowNoticeAIInline} setAIIsLoading={setAIIsLoading} />
					</ToolbarButton>
				)}
			</StyledMenu>
		</Portal>
	)
}

const ClickableWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const ToolbarButton = styled.div<{ active?: boolean }>`
	flex: 0 0 36px;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	background-color: ${({ theme }) => theme.colors.dark};

	/* easy way to set the bg color for all svgs, if any issue, directly edit the color inside the icons */
	svg,
	rect {
		background-color: ${({ theme }) => theme.colors.dark};
		fill: ${({ theme }) => theme.colors.dark};
	}

	path {
		fill: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.white)};
	}

	:hover {
		path {
			fill: ${({ theme }) => theme.colors.primary};
		}
	}
`

const StyledMenu = styled.div<any>`
	display: flex;
	padding: 8px 7px 6px;
	position: absolute;
	z-index: 1;
	top: -10000px;
	left: -10000px;
	margin-top: -6px;
	opacity: 0;
	background-color: ${(props) => props.theme.colors.dark};
	border-radius: 4px;
	transition: opacity 0.75s;
`
