import { CSSProperties } from 'react'
import styled, { useTheme } from 'styled-components'
import Tick from '../icons/Tick'

interface StepsData {
	label: string
	step: number
}

interface Props {
	// it is better to keep this structure it gets messy if handle this with array index if this is so much
	// you can just send a array of string ['step 1', 'step 2', 'step 3'] we can use the array index as step number
	steps: StepsData[]
	activeStep: number // active step comes from state controlling the state if progress
	style?: CSSProperties
}

export const Stepper = ({ steps, activeStep, style }: Props) => {
	const theme = useTheme()

	const totalSteps = steps.length
	const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`

	return (
		<RelativeStepsContainer width={width} style={style}>
			{steps.map(({ label, step }) => (
				<RelativeStepsWrapper key={step}>
					<StepsCircleContainer completed={activeStep >= step}>
						{activeStep > step ? (
							<Tick size={12} color={theme.colors.white} />
						) : (
							<StepCount completed={activeStep >= step}>{step}</StepCount>
						)}
					</StepsCircleContainer>
					<StepsLabelContainer>
						<StepLabel completed={activeStep >= step} key={step}>
							{label}
						</StepLabel>
					</StepsLabelContainer>
				</RelativeStepsWrapper>
			))}
		</RelativeStepsContainer>
	)
}

const RelativeStepsContainer = styled.div<{ width: string }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	width: 400px;
	margin: 0 auto;

	:before {
		content: '';
		position: absolute;
		background: ${({ theme }) => theme.colors.lightGrey};
		height: 4px;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
		left: 0;
	}

	:after {
		content: '';
		position: absolute;
		background: ${({ theme }) => theme.colors.primary};
		height: 4px;
		width: ${({ width }) => width};
		top: 50%;
		transition: 0.4s ease;
		transform: translateY(-50%);
		left: 0;
	}
`

const RelativeStepsWrapper = styled.div`
	position: relative;
	z-index: 1;
`

const StepsCircleContainer = styled.div<{ completed: boolean }>`
	width: 20px; // change this to increase the size of the circle
	height: 20px; // change this to increase the size of the circle
	border-radius: 50%;
	background-color: ${({ completed, theme }) => (completed ? theme.colors.primary : theme.colors.white)};
	border: 3px solid ${({ completed, theme }) => (completed ? theme.colors.primary : theme.colors.lightGrey)};
	transition: 0.4s ease;
	display: flex;
	justify-content: center;
	align-items: center;
`

const StepCount = styled.span<{ completed: boolean }>`
	width: fit-content;
	height: 15px;

	font-size: 12px;
	color: ${({ completed, theme }) => (completed ? theme.colors.white : theme.colors.grey)};
`

const StepsLabelContainer = styled.div`
	width: 120px;
	text-align: center;
	position: absolute;
	top: 50px; // change to increase the space between circle and label
	left: 50%;
	transform: translate(-50%, -50%);
`

const StepLabel = styled.span<{ completed: boolean }>`
	font-size: 14px;
	color: ${({ completed, theme }) => (completed ? theme.colors.primary : theme.colors.grey)};
`
