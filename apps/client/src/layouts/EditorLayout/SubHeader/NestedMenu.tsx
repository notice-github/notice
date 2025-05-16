// import { Placement } from '@popperjs/core'
// import { useEffect, useMemo, useState } from 'react'
// import { usePopper } from 'react-popper'
// import styled, { useTheme } from 'styled-components'
// import { MenuBackground } from '../../../components/Menu/MenuBackground'
// import { MenuSearch } from '../../../components/Menu/MenuSearch'
// import { Portal } from '../../../components/Portal'
// import { Show } from '../../../components/Show'
// import { useListenForOutsideClicks } from '../../../hooks/useListenForOutsideClicks'

// interface Props<T> {
// 	closing: boolean
// 	anchorRef: T | null
// 	placement?: Placement
// 	offset?: [number, number]
// 	minWidth?: string
// 	maxWidth?: string
// 	maxHeight?: string
// 	searchable?: boolean
// 	disableOutsideClick?: boolean
// 	searchPlaceholder?: string
// 	scrollable?: boolean
// 	onClose?: () => any
// 	onOutsideClick?: () => void
// 	disableClickInside?: boolean
// 	children: React.ReactElement | React.ReactElement[]
// }

// const toAnimation = (placement?: string) => {
// 	if (placement == undefined) return undefined

// 	switch (placement) {
// 		case 'top':
// 		case 'top-end':
// 		case 'top-start':
// 			return 'bottom-to-top'
// 		case 'bottom':
// 		case 'bottom-end':
// 		case 'bottom-start':
// 			return 'top-to-bottom'
// 		case 'right':
// 		case 'right-end':
// 		case 'right-start':
// 			return 'right-to-left'
// 		case 'left':
// 		case 'left-end':
// 		case 'left-start':
// 			return 'left-to-right'
// 	}
// }

// export const NestedMenu = <T extends HTMLElement>({
// 	closing,
// 	anchorRef,
// 	placement,
// 	offset,
// 	minWidth,
// 	maxWidth,
// 	maxHeight,
// 	searchable = false,
// 	disableOutsideClick = false,
// 	searchPlaceholder,
// 	scrollable = true,
// 	onClose,
// 	onOutsideClick,
// 	children,
// 	disableClickInside = true,
// }: Props<T>) => {
// 	const theme = useTheme()

// 	const [show, setShow] = useState(false)
// 	const [search, setSearch] = useState('')

// 	const filteredChildren = useMemo(() => {
// 		const allChildren = !Array.isArray(children) ? [children] : children

// 		return allChildren.filter((child) => {
// 			const { text } = child.props

// 			if (typeof text !== 'string') return true
// 			else return text.toLowerCase().includes(search.toLowerCase())
// 		})
// 	}, [children, search])

// 	const [popperRef, setPopperRef] = useState<HTMLDivElement | null>(null)
// 	const { styles, attributes } = usePopper(anchorRef, popperRef, {
// 		placement: placement ?? 'bottom-start',
// 		modifiers: offset
// 			? [
// 					{
// 						name: 'offset',
// 						options: {
// 							offset: offset,
// 						},
// 					},
// 			  ]
// 			: undefined,
// 	})

// 	const close = () => {
// 		if (!disableClickInside) {
// 			return
// 		} else {
// 			setShow(disableOutsideClick)
// 			setTimeout(() => {
// 				onClose?.call(onClose)
// 			}, 150)
// 		}
// 	}

// 	const onOuterClick = () => {
// 		close()

// 		if (onOutsideClick && !disableOutsideClick) {
// 			onOutsideClick?.call(onOutsideClick)
// 		}
// 	}

// 	// Handle the animation
// 	useEffect(() => {
// 		if (attributes?.popper == undefined || show) return

// 		const timeout = setTimeout(() => {
// 			setShow(true)
// 		}, 75)

// 		return () => clearTimeout(timeout)
// 	}, [attributes?.popper])

// 	// Handle manual closing
// 	useEffect(() => {
// 		if (closing) close()
// 	}, [closing])

// 	useListenForOutsideClicks(
// 		[anchorRef, popperRef],
// 		() => {
// 			onOuterClick()
// 		},
// 		show
// 	)

// 	return (
// 		<Portal>
// 			<div
// 				ref={setPopperRef}
// 				style={{ zIndex: theme.zIndex.menu, ...styles.popper }}
// 				{...attributes.popper}
// 				onClick={(e) => e.stopPropagation()}
// 			>
// 				<MenuBackground
// 					animation={toAnimation(attributes?.popper?.['data-popper-placement'])}
// 					minWidth={minWidth ?? '175px'}
// 					maxWidth={maxWidth}
// 					show={show}
// 				>
// 					<Show when={searchable}>
// 						<MenuSearch value={search} placeholder={searchPlaceholder} onChange={(e) => setSearch(e.target.value)} />
// 					</Show>
// 					{scrollable && <ScrollWrapper maxHeight={maxHeight}>{filteredChildren}</ScrollWrapper>}
// 					{!scrollable && filteredChildren}
// 				</MenuBackground>
// 			</div>
// 		</Portal>
// 	)
// }

// const ScrollWrapper = styled.div<{ maxHeight?: string }>`
// 	overflow-y: auto;
// 	overflow-x: hidden;
// 	overscroll-behavior: none;
// 	max-height: ${({ maxHeight }) => maxHeight ?? '300px'};
// `
