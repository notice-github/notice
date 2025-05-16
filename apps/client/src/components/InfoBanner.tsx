import { darken } from 'polished'
import { ReactNode } from 'react'
import styled, { useTheme } from 'styled-components'
import { CrossIcon } from '../icons'
import { Row } from './Flex'

interface Props {
	background: string
	textColor: string
	width?: string
	content: ReactNode
	isClosable?: boolean
	iconColor?: string
	position?: string
	onClose?: () => void
}

export const InfoBanner = ({
	background,
	textColor,
	content,
	isClosable,
	iconColor,
	onClose,
	width,
	position,
}: Props) => {
	const theme = useTheme()
	return (
		<AbsoluteWrapper background={background} position={position} width={width} textColor={textColor}>
			<Row>
				<Centered>{content}</Centered>
				{isClosable && (
					<IconWrapper background={background} onClick={onClose}>
						<CrossIcon size={10} color={iconColor ?? theme.colors.white} />
					</IconWrapper>
				)}
			</Row>
		</AbsoluteWrapper>
	)
}

const AbsoluteWrapper = styled.div<Pick<Props, 'background' | 'textColor' | 'width' | 'position'>>`
	position: ${({ position }) => position ?? 'absolute'};
	background-color: ${({ background }) => background};
	color: ${({ textColor }) => textColor};

	top: 0;
	left: 0;

	width: ${({ width }) => width ?? '100%'};
	padding: 4px;
	box-sizing: border-box;
`

const Centered = styled.div`
	text-align: center;
	width: calc(100% - 20px);
`

const IconWrapper = styled.div<Pick<Props, 'background'>>`
	width: 20px;
	height: 20px;
	padding: 4px;

	display: flex;
	align-items: center;
	justify-content: center;

	cursor: pointer;
	background-color: transparent;
	transition: 0.3s background-color ease;
	border-radius: ${({ theme }) => theme.borderRadius};

	&:hover {
		background-color: ${({ background }) => darken(0.1, background)};
	}
`
