import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	show: boolean
	minWidth: string
	maxWidth?: string
	maxHeight?: string
	animation?: 'top-to-bottom' | 'bottom-to-top' | 'right-to-left' | 'left-to-right'
}

export const MenuBackground = (props: Props) => {
	return <StyledDiv {...props}>{props.children}</StyledDiv>
}

const StyledDiv = styled.div<Props>`
	display: flex;
	flex-direction: column;
	overflow: hidden;

	min-width: ${({ minWidth }) => minWidth};
	max-width: ${({ maxWidth }) => maxWidth};
	max-height: ${({ maxHeight }) => maxHeight};

	background-color: ${({ theme }) => theme.colors.white};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: ${({ theme }) => theme.borderRadius};
	
	box-shadow: rgb(0 0 0 / 10%) 0px 2px 7px;

	opacity: ${(props) => (props.show ? 1 : 0)};
	transform: ${({ show, animation }) => {
		if (show) return 'translateY(0px)'

		switch (animation) {
			case 'top-to-bottom':
				return 'translateY(-16px)'
			case 'bottom-to-top':
				return 'translateY(16px)'
			case 'left-to-right':
				return 'translationX(-16px)'
			case 'right-to-left':
				return 'translationX(16px)'
			default:
				return 'translateY(0px)'
		}
	}};
	
	transition: transform 0.15s ease, opacity 0.15s ease;
`
