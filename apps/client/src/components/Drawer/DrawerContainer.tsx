import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Portal } from '../../components/Portal'
import { useOnKeyPressed } from '../../hooks/useKeyPressed'
import { CrossIcon } from '../../icons'

interface Props {
	opened: boolean
	onClose?: () => any
	children?: React.ReactNode
}

export const DrawerContainer = ({ opened, onClose, children }: Props) => {
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
					if (pageRef.current != null && pageRef.current.contains(e.target as Node)) return
					close()
				}}
			>
				<Page ref={pageRef} show={show}>
					<Wrapper>
						<ExitButton onClick={close}>
							<CrossIcon color={theme.colors.greyDark} size={12} />
						</ExitButton>
						<Content>{children}</Content>
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

	transition: opacity 0.5s ease;
`

const Page = styled.div<{ show: boolean }>`
	position: absolute;
	cursor: default;
	top: 0;
	left: 100%;

	max-width: 100%;
	width: 600px;
	height: 100%;

	overflow-y: auto;
	overflow-x: hidden;
	transform: ${({ show }) => (show ? 'translateX(-100%)' : 'translateX(100%)')};
	transition: transform 0.5s ease;

	background-color: ${({ theme }) => theme.colors.white};
`

const Wrapper = styled.div`
	height: 100%;
	overflow-y: auto;
`

const Content = styled.div`
	padding: 0;
`

const ExitButton = styled.div`
	position: sticky;
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
