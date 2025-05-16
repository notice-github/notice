import styled from 'styled-components'
import { calculateLinearGradientColor } from '../utils/color'

interface Props {
	cursor: number
	unit: string
	color1: string
	color2: string
	width?: number
}

export const ProgressBar = ({ cursor, unit, color1, color2, width }: Props) => {
	const interpolatedColor = calculateLinearGradientColor(color1, color2, cursor)

	return (
		<Container width={width}>
			<ProgressFiller completed={cursor < 5 ? 5 : cursor} color={interpolatedColor}></ProgressFiller>
			<PercentageWrapper>
				<Percentage>
					{(cursor + 0.1).toFixed(1)} {unit}
				</Percentage>
			</PercentageWrapper>
		</Container>
	)
}

const ProgressFiller = styled.div<{ completed: number; color: string }>`
	height: 100%;
	width: ${({ completed }) => (completed > 0 ? completed : completed)}%;
	background-color: ${({ color }) => color};
	border-radius: inherit;
	text-align: right;
	transition: width 1s ease-in-out;
`

const Container = styled.div<{ width?: number }>`
	width: ${({ width }) => `${width}px` ?? '100%'};
	height: 20px;
	background-color: #e0e0de;
	border-radius: 50px;
`

const PercentageWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`

const Percentage = styled.div`
	color: ${({ theme }) => theme.colors.textGrey};
	font-size: 14px;
	font-style: normal;
	font-weight: 500;
	line-height: 24px;
	padding-left: 20px;
	text-align: right;
`
