import { useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { Cross } from '../../../Icons'
import { useOnKeyPressed } from '../../hooks/useOnKeyPressed'
import { Portal } from '../Portal'

interface Props {
	open: boolean
	setOpen: (value: boolean) => void
	fullHeight?: boolean
	children?: React.ReactNode
}

export const Modal = ({ open, setOpen, fullHeight = false, children }: Props) => {
	const theme = useTheme()
	const pageRef = useRef<HTMLDivElement | null>(null)

	const close = () => {
		setOpen(false)
	}

	useOnKeyPressed('escape', () => close())

	return (
		<Portal>
			<Background
				show={open}
				onClick={(e) => {
					if (pageRef.current != null && pageRef.current.contains(e.target as Node)) return
					close()
				}}
			>
				<Page ref={pageRef} show={open} fullHeight={fullHeight}>
					<Wrapper fullHeight={fullHeight}>
						<ExitButton onClick={close}>
							<Cross color={theme.colors.greyDark} size={12} />
						</ExitButton>
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

const Page = styled.div<{ show: boolean; fullHeight: boolean }>`
	margin: ${({ theme }) => theme.modalMargin};
	max-width: 1280px;

	height: ${({ theme, fullHeight }) => (fullHeight ? `calc(100vh - ${theme.modalMargin} * 2)` : undefined)};
	max-height: ${({ theme, fullHeight }) => (fullHeight ? undefined : `calc(100vh - ${theme.modalMargin} * 2)`)};

	overflow-y: ${({ fullHeight }) => (fullHeight ? 'hidden' : 'auto')};
	overflow-x: hidden;
	transform: ${({ show }) => (show ? 'scale(1)' : 'scale(0.9)')};

	border-radius: 8px;
	background-color: ${({ theme }) => theme.colors.white};

	transition: transform 0.15s ease-in-out;
`

const Wrapper = styled.div<{ fullHeight: boolean }>`
	height: 100%;
	overflow-y: ${({ fullHeight }) => (fullHeight ? 'auto' : undefined)};
`

const Content = styled.div<{ noPadding: boolean }>`
	padding-right: ${({ noPadding }) => (noPadding ? undefined : '52px')};
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
