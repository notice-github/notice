import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { TemplateType } from '.'
import { Consts } from '../../../utils/consts'
import { AiCircularProgress } from './AiCircularProgress'
import { MessageCarousel } from './MessageCarousel'

interface Props {
	delay: number
	selectedTemplate: TemplateType | null
	onSkip: () => void
}

export const ProgressIndicator = ({ delay, onSkip, selectedTemplate }: Props) => {
	const [progress, setProgress] = useState(0)
	const [, setTime] = useState(0)
	const theme = useTheme()

	const getProgressColors = () => {
		if (progress <= 45) return theme.colors.twilightDarkGrey
		else if (progress <= 75) return theme.colors.primary
		else if (progress > 75) return theme.colors.success

		return theme.colors.success
	}

	const color = getProgressColors()

	useEffect(() => {
		setInterval(() => {
			setTime((c) => {
				setProgress((c * 100) / delay)
				if (c >= delay) return c
				return c + 1
			})
		}, 1000)
	}, [])

	return (
		<PositionedOverlay>
			<InfoICard>
				<AiCircularProgress progress={progress} color={color} />
				<MessageCarousel
					delay={10_000}
					messages={Consts.AI_LOADING_MESSAGES}
					style={{
						color: color,
						fontSize: '14px',
						fontStyle: 'normal',
						fontWeight: '500',
						lineHeight: '24px',
					}}
				/>

				<DividerWithText>
					<span>Getting late ?</span>
				</DividerWithText>

				<LinkButton
					onClick={onSkip}
					color={selectedTemplate?.color}
				>{`Use our default ${selectedTemplate?.name} template instead`}</LinkButton>
			</InfoICard>
		</PositionedOverlay>
	)
}

const PositionedOverlay = styled.div`
	width: 100%;
	height: 100%;

	position: absolute;
	inset: 0;
	background-color: rgba(27, 30, 33, 0.27);
	backdrop-filter: blur(1px);
	z-index: 2;
	border-radius: 4px;

	display: flex;
	justify-content: center;
	align-items: center;
`
const InfoICard = styled.div`
	width: 400px;
	height: fit-content;
	background-color: ${({ theme }) => theme.colors.white};
	padding: 8px;

	border-radius: 6px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 6px;

	animation: scaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;

	@keyframes scaleUp {
		0% {
			transform: scale(0.8) translateY(1000px);
			opacity: 0;
		}
		100% {
			transform: scale(1) translateY(0px);
			opacity: 1;
		}
	}
`

const DividerWithText = styled.h5`
	width: 100%;
	text-align: center;
	border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
	line-height: 0.1em;
	margin: 10px 0 20px;

	span {
		background: #fff;
		color: ${({ theme }) => theme.colors.textGrey};
		padding: 0 10px;
	}
`

const LinkButton = styled.div<{ color?: string }>`
	cursor: pointer;
	text-decoration: underline;
	color: ${({ theme }) => theme.colors.twilightGrey};

	&:hover {
		color: ${({ color }) => color};
	}
`
