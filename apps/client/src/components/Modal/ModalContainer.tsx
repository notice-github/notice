import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Portal } from '../../components/Portal'
import { useOnKeyPressed } from '../../hooks/useKeyPressed'
import { CrossIcon } from '../../icons'
import { Show } from '../Show'

export interface ModalProps {
	opened: boolean
	onClose?: () => any
	fullHeight?: boolean
	doNotShowExit?: boolean
	children?: React.ReactNode
	fullPage?: boolean
	backgroundColor?: string
	disableClickOutside?: boolean
	lightExit?: boolean // make the exit button less visible
	width?: string
}

export const ModalContainer = ({
	opened,
	onClose,
	fullHeight = false,
	fullPage = false,
	children,
	backgroundColor,
	disableClickOutside = false,
	doNotShowExit = false,
	lightExit = false,
	width,
}: ModalProps) => {
	const theme = useTheme()
	const [show, setShow] = useState(false)
	const pageRef = useRef<HTMLDivElement | null>(null)

	const close = () => {
		setShow(false)
		setTimeout(() => {
			onClose?.call(onClose)
		}, 150)
	}

	// useEffect to handle the animation
	useEffect(() => {
		if (opened) {
			setShow(true)
		} else if (show) {
			close()
		}
	}, [opened])

	useOnKeyPressed('escape', () => close())

	return (
		<Portal>
			<Background
				show={show}
				onClick={(e) => {
					if (disableClickOutside) return
					if (pageRef.current != null && pageRef.current.contains(e.target as Node)) return
					close()
				}}
			>
				<Page
					ref={pageRef}
					show={show}
					fullHeight={fullHeight}
					fullPage={fullPage}
					backgroundColor={backgroundColor}
					width={width}
				>
					<Wrapper fullHeight={fullHeight}>
						<Show when={!doNotShowExit}>
							<ExitButton onClick={close}>
								<CrossIcon color={lightExit ? theme.colors.lightGrey : theme.colors.greyDark} size={12} />
							</ExitButton>
						</Show>

						<Content noPadding={!fullHeight}>{children}</Content>
					</Wrapper>
				</Page>
			</Background>
		</Portal>
	)
}

const Background = styled.div<{ show: boolean }>`
	position: fixed;
	inset: 0;

	display: flex;
	justify-content: center;
	align-items: center;

	background-color: rgba(0, 0, 0, 0.6);

	overflow: hidden;
	z-index: ${({ theme }) => theme.zIndex.modal};
	opacity: ${(props) => (props.show ? '1' : '0')};

	transition: opacity 0.15s ease-in-out;
`

const Page = styled.div<{
	show: boolean
	fullHeight: boolean
	fullPage: boolean
	backgroundColor?: string
	width?: string
}>`
	margin: ${({ theme, fullPage }) => (fullPage ? 0 : theme.modalMargin)};
	max-width: ${({ fullPage, width }) => (fullPage ? '100vw' : width ?? '1280px')};
	width: ${({ width, fullPage }) => {
		if (fullPage) return '100%'
		return width ? '100%' : undefined
	}};

	height: ${({ theme, fullHeight, fullPage }) => {
		if (fullPage) return '100vh'
		return fullHeight ? `calc(100vh - ${theme.modalMargin} * 2)` : undefined
	}};
	max-height: ${({ theme, fullHeight }) => (fullHeight ? undefined : `calc(100vh - ${theme.modalMargin} * 2)`)};

	overflow-y: ${({ fullHeight }) => (fullHeight ? 'hidden' : 'auto')};
	overflow-x: hidden;
	transform: ${({ show }) => (show ? 'scale(1)' : 'scale(0.9)')};

	border-radius: ${({ fullPage }) => (fullPage ? '0px' : '8px')};
	background-color: ${({ theme, backgroundColor }) => backgroundColor ?? theme.colors.white};

	transition: transform 0.15s ease-in-out;
	position: relative;
`

const Wrapper = styled.div<{ fullHeight: boolean }>`
	height: 100%;
	overflow-y: ${({ fullHeight }) => (fullHeight ? 'auto' : undefined)};
`

const Content = styled.div<{ noPadding: boolean }>`
	height: 100%;
	padding-right: ${({ noPadding }) => (noPadding ? undefined : '52px')};
`

const ExitButton = styled.div`
	position: sticky;
	z-index: 3;
	float: right;
	top: 8px;
	right: 8px;

	padding: 16px;

	display: flex;
	align-items: center;
	justify-content: center;

	cursor: pointer;

	&:hover line {
		stroke: ${({ theme }) => theme.colors.primary};
		fill: ${({ theme }) => theme.colors.primary};
		transition: opacity 0.5s ease-in-out;
	}
`
