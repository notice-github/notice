import styled, { useTheme } from 'styled-components'
import { Column, Row } from '../../components/Flex'
import { EyeOffIcon } from '../../icons'
import { Pages } from '../../pages'
import { Router } from '../../router'

export const AnalyticsTurnedOffMessage = () => {
	const theme = useTheme()

	return (
		<HiddenMessage>
			<Row justify="center" align="center" gap={12}>
				<RoundIconContainer>
					{' '}
					<EyeOffIcon size={24} color={theme.colors.primary} />{' '}
				</RoundIconContainer>
				<Column gap={6} justify="center" align="start">
					<h3>User tracking has been turned off for this project.</h3>
					<SubText>
						We have stopped tracking users actions for this project but You can turn it back on {''}
						<LinkButton onClick={() => Router._router.navigate(Pages.CUSTOMIZATION_GENERAL)}>
							here in customization.
						</LinkButton>
					</SubText>
				</Column>
			</Row>
		</HiddenMessage>
	)
}

const RoundIconContainer = styled.div`
	width: 48px;
	height: 48px;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.white};
	box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
	flex-shrink: 0;
`

const HiddenMessage = styled.div`
	position: sticky;

	top: 30%;
	left: 45%;

	width: 370px;
	height: fit-content;
	background-color: ${({ theme }) => theme.colors.white};
	box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
	padding: 16px;
	border-radius: ${({ theme }) => theme.borderRadius};

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	gap: 8px;
	color: ${({ theme }) => theme.colors.primaryDark};
	z-index: 2;
`

const LinkButton = styled.span`
	cursor: pointer;
	text-decoration: underline;
	color: ${({ theme }) => theme.colors.textGrey};
`

const SubText = styled.div`
	width: 100%;
	font-size: 14px;
`
