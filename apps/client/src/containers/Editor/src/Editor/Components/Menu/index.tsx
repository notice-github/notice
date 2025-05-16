import { Placement } from '@popperjs/core'
import { useEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import styled, { css, useTheme } from 'styled-components'

import { Editor, Selection, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { useSlashMenu } from '../../SlashMenu/SlashMenuProvider'
import { useListenForOutsideClicks } from '../../hooks/useListenForOutsideClicks'
import { Portal } from '../Portal'
import { MenuBackground } from './MenuBackground'
import { MenuSectionNoResult } from './MenuSectionTitle'

interface Props<T> {
	closing: boolean
	anchorRef: T | null
	placement?: Placement
	offset?: [number, number]
	minWidth?: string
	maxWidth?: string
	maxHeight?: string
	searchable?: boolean
	searchPlaceholder?: string
	onClose?: () => any
	children: React.ReactElement | React.ReactElement[]
	// disable keydowns and focus events
	simpleMenu?: boolean
	initialSelect?: Selection
}

const toAnimation = (placement?: string) => {
	if (placement == undefined) return undefined

	switch (placement) {
		case 'top':
		case 'top-end':
		case 'top-start':
			return 'bottom-to-top'
		case 'bottom':
		case 'bottom-end':
		case 'bottom-start':
			return 'top-to-bottom'
		case 'right':
		case 'right-end':
		case 'right-start':
			return 'right-to-left'
		case 'left':
		case 'left-end':
		case 'left-start':
			return 'left-to-right'
	}
}

export const Menu = <T extends HTMLElement>({
	closing,
	anchorRef,
	placement,
	offset,
	minWidth,
	maxWidth,
	maxHeight,
	searchable = false,
	onClose,
	children,
	simpleMenu,
	initialSelect,
}: Props<T>) => {
	const [show, setShow] = useState(false)
	const [search, setSearch] = useState('')
	const editor = useSlate()
	const theme = useTheme()
	const { slashOpen, setSlashOpen } = useSlashMenu()
	const filteredChildren: React.ReactElement | React.ReactElement[] = useMemo(() => {
		const allChildren = !Array.isArray(children) ? [children] : children
		if (!searchable) return allChildren

		const result = allChildren.filter((child) => {
			const { keywords = [], name = '' } = child.props

			const fullText = keywords.concat(name).join('')
			if (typeof fullText !== 'string') return true
			else return fullText.toLowerCase().includes(search.toLowerCase())
		})
		// if no results, return all children, may improve by adding a "no results" message
		if (!result.length)
			return [
				<MenuSectionNoResult name={'noresults'} key={'noresults'} text={'No results'} subtype={'SectionNoResult'} />,
			]
		return result
	}, [children, search])

	const [popperRef, setPopperRef] = useState<HTMLDivElement | null>(null)
	const { styles, attributes } = usePopper(anchorRef, popperRef, {
		placement: placement ?? 'bottom-start',
		modifiers: offset
			? [
					{
						name: 'offset',
						options: {
							offset: offset,
						},
					},
			  ]
			: undefined,
	})

	const close = () => {
		setShow(false)
		setTimeout(() => {
			onClose?.call(onClose)
		}, 150)
	}

	// close menu when user clicks outside of menu and reference element
	useListenForOutsideClicks([anchorRef, popperRef], () => close(), show)

	// this blocks the scroll
	useEffect(() => {
		// block the scroll when the menu is open
		document.body.style.overflow = show ? 'hidden' : 'auto'
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [show])

	// Handle the animation
	useEffect(() => {
		if (attributes?.popper == undefined || show) return

		const timeout = setTimeout(() => {
			setShow(true)
		}, 75)

		return () => clearTimeout(timeout)
	}, [attributes?.popper])

	// Handle manual closing
	useEffect(() => {
		if (closing) close()
	}, [closing])

	// Handle click outside closing, re-instantiate each time we type
	useEffect(() => {
		document.addEventListener('keydown', handleKeyboardEvents)
		return () => {
			document.removeEventListener('keydown', handleKeyboardEvents)
		}
	}, [show, popperRef, search])

	// Focus first item on open and search changes
	useEffect(() => {
		const menuItems = document.getElementsByClassName('menu-item') as HTMLCollectionOf<HTMLElement>
		if (menuItems.length === 0) return
		menuItems[0].focus({ preventScroll: true })
	}, [search])

	// Escape and ArrowDown key handling
	const handleKeyboardEvents = (e: KeyboardEvent) => {
		if (searchable && e.key?.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
			// WARNING SENSITIVE STUFF

			setSearch((state) => state + e.key)

			if (initialSelect) {
				// hardcoding the offset is a fix for bugs with Firefox linked to wrong focus
				Transforms.insertText(editor, e.key, { at: { path: initialSelect.anchor.path, offset: search.length + 1 } })
			}
		}
		if (searchable && e.key === 'Backspace' && initialSelect && Editor.string(editor, initialSelect.anchor.path)) {
			setSearch((state) => state.slice(0, -1))
			Transforms.select(editor, initialSelect)

			// check if the slash menu is open and remove the slash in the editor without moving the line
			if (Editor.string(editor, initialSelect.anchor.path) === '/') {
				Editor.deleteBackward(editor, { unit: 'character' })
				slashOpen && setSlashOpen(false)
			} else {
				Transforms.move(editor, { unit: 'line' })
				Editor.deleteBackward(editor, { unit: 'character' })
			}
		}

		if (e.key === 'Escape') {
			setSearch('')

			if (initialSelect && Editor.string(editor, initialSelect.anchor.path)) {
				Transforms.select(editor, initialSelect)
				Transforms.move(editor, { unit: 'line' })
				Editor.deleteBackward(editor, { unit: 'word' })
			}

			close()
			ReactEditor.focus(editor)
		}
	}

	return (
		<Portal>
			<div
				ref={setPopperRef}
				style={{
					// a menu always shows above everything else
					zIndex: theme.zIndex.hoveringBars,
					...styles.popper,
				}}
				{...attributes.popper}
			>
				<MenuBackground
					animation={toAnimation(attributes?.popper?.['data-popper-placement'])}
					minWidth={minWidth ?? '175px'}
					maxWidth={maxWidth}
					show={show}
					maxHeight={maxHeight}
				>
					<ScrollWrapper>
						{filteredChildren.map((child) => {
							if (simpleMenu) {
								return child
							}

							const type = child?.props?.subtype ?? 'MenuItem'
							const key = child?.key ?? child?.props?.name

							return (
								<MenuItemWrapper
									className={type === 'MenuItem' ? 'menu-item' : 'other-item'}
									key={key}
									// make the items focusable with keyboard
									tabIndex={type === 'MenuItem' ? 0 : -1}
									type={type}
									onKeyDown={(e: any) => {
										if (e.key === 'ArrowDown') {
											e.preventDefault()

											// if the next sibling is a menu item, focus it, otherwise focus the next sibling
											// works only when there's always a max of one divider between menu items
											const nextSibling = e.currentTarget.nextSibling
											if (!nextSibling) return
											if (nextSibling.tabIndex === 0) {
												nextSibling.focus()
											} else if (nextSibling.nextSibling) {
												nextSibling.nextSibling.focus()
											}
										}

										if (e.key === 'ArrowUp') {
											e.preventDefault()
											// if the previous sibling is a menu item, focus it, otherwise focus the previous sibling
											// works only when there's always a max of one divider between menu items

											const prevSibling = e.currentTarget.previousSibling
											if (!prevSibling) return

											if (prevSibling.tabIndex === 0) {
												prevSibling.focus()
											} else if (prevSibling.previousSibling) {
												prevSibling.previousSibling.focus()
											}
										}

										if (e.key === 'Enter') {
											e.preventDefault()
											child.props.onClick()
										}
									}}
									// TODO: fix it shall fake focus the first element when something else is focused
								>
									{child}
								</MenuItemWrapper>
							)
						})}
					</ScrollWrapper>
				</MenuBackground>
			</div>
		</Portal>
	)
}

const MenuItemWrapper = styled.div<any>`
	pointer-events: ${({ type }) => (type === 'MenuItem' ? 'auto' : 'none')};
	:hover,
	:focus {
		border: none;
		outline: none;
		background-color: ${({ theme }) => theme.colors.primaryExtraLight};
	}
	${({ forceFocusBackground, theme }) => {
		return (
			forceFocusBackground &&
			css`
				background-color: ${theme.colors.primaryExtraLight};
				border: none;
				outline: none;
			`
		)
	}}

	transition: background-color 100ms ease-out;
`

const ScrollWrapper = styled.div`
	overflow-y: auto;
	overflow-x: hidden;
	overscroll-behavior: none;
`
