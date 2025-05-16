import styled, { useTheme } from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'span'> {
	size?: number
	color?: string
}

export const Loader = ({ size = 24, color, ...props }: Props) => {
	const theme = useTheme()

	return <StyledLoader size={size} color={color ?? theme.colors.primary} {...props}></StyledLoader>
}

const StyledLoader = styled.span<{ size: number }>`
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: ${({ size }) => 0.08 * size + 1.2}px solid ${({ color }) => color};
	border-bottom-color: transparent;
	border-radius: 100%;
	display: inline-block;
	box-sizing: border-box;
	animation: rotation 0.7s linear infinite;
    
	@keyframes rotation {
    0% {
			transform: rotate(0deg);
    }
    100% {
			transform: rotate(360deg);
    }
	}
`
