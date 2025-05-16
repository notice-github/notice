import styled, { useTheme } from 'styled-components'

interface Props {
	progress: number
	color: string
}

export const AiCircularProgress = ({ progress, color }: Props) => {
	const theme = useTheme()

	const SIZE = 150

	const center = SIZE / 2,
		radius = center - 10,
		dashArray = 2 * Math.PI * radius,
		dashOffset = dashArray * ((104 - progress) / 104)

	const percentage = progress > 99 ? 99 : Math.round(progress)

	return (
		<OuterProgress size={SIZE}>
			<StyledSvg size={SIZE}>
				<circle
					cx={center}
					cy={center}
					fill="transparent"
					r={radius}
					stroke={theme.colors.borderLight}
					strokeWidth={8}
				/>
				<circle
					cx={center}
					cy={center}
					fill="transparent"
					r={radius}
					stroke={color}
					strokeWidth={8}
					strokeDasharray={dashArray}
					strokeDashoffset={dashOffset}
					strokeLinecap={'round'}
				/>
			</StyledSvg>

			<LabelWrapper>
				<TextLabel>generating...</TextLabel>
				<TextPercentage>{`${percentage > 99 ? 99 : percentage}%`}</TextPercentage>
			</LabelWrapper>
		</OuterProgress>
	)
}

const OuterProgress = styled.div<{ size: number }>`
	position: relative;
	width: ${({ size }) => size + 'px'};
	height: ${({ size }) => size + 'px'};
`

const StyledSvg = styled.svg<{ size: number }>`
	transform: rotate(-90deg);
	width: ${({ size }) => size + 'px'};
	height: ${({ size }) => size + 'px'};

	circle {
		transition: stroke 1s ease-in-out;
	}
`

const LabelWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
`

const TextLabel = styled.div`
	opacity: 0.5;
	font-size: 0.75em;
	color: ${({ theme }) => theme.colors.textGrey};

	clip-path: inset(0 9px 0 0);
	animation: l 1s steps(3) infinite;

	@keyframes l {
		to {
			clip-path: inset(0 -7px 0 0);
		}
	}
`

const TextPercentage = styled.div`
	font-size: 1.5em;
	font-weight: bold;
	color: ${({ theme }) => theme.colors.textGrey};
`
