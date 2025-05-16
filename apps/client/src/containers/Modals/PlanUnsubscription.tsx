import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useBillingDetails } from '../../hooks/api/useBillingDetails'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'

export const PlanUnsubscription = () => {
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const [agreement, setAgreement] = useState(false)
	const billingDetails = useBillingDetails()

	const handleChange = (event: any) => {
		setAgreement(event.target.checked)
	}

	return (
		<Container>
			<Title>Cancel subscription</Title>
			<WarningHeader>
				<TextWarning>{`Are you sure? You are about to cancel your subscription and will loose all your advantages. Make sure to read this before any changes.`}</TextWarning>
			</WarningHeader>
			<Ul>
				<List>{`The "Created with Notice" label will be back to your projects`}</List>
				<List>{`You will be limited to create 2 projects, and any extra projects will be disabled. Only 2 of them will remain available`}</List>
				<List>{`All other members will be deleted from your workspace`}</List>
				<List>{`You will no longer have access to Notice AI`}</List>
				<List>{`All heavy uploads will be removed from our storage`}</List>
			</Ul>
			<CheckBoxWrapper>
				<label>
					<input type="checkbox" onChange={handleChange} />
					<CheckBoxMessage style={{ fontSize: '14px' }}>
						I understand the consequences of unsubscribing and accept them
					</CheckBoxMessage>
				</label>
			</CheckBoxWrapper>
			<Footer>
				<Button
					padding="8px 16px"
					color={theme.colors.white}
					textColor={theme.colors.error}
					style={{ fontWeight: 700, border: `2px solid ${theme.colors.error}` }}
					onClick={() => Modals.planUnsubscription.close()}
				>
					Cancel
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.error}
					style={{ fontWeight: 600 }}
					disabled={!agreement}
					loader={billingDetails.isLoading}
					onClick={async () => {
						if (billingDetails.isLoading) return
						const url = await billingDetails.mutateAsync({ workspace })
						window.location.href = url
					}}
				>
					Proceed
				</Button>
			</Footer>
		</Container>
	)
}

const CheckBoxWrapper = styled.div`
	margin-top: 10px;
`
const CheckBoxMessage = styled.span`
	font-size: 14px;
	font-weight: 500px;
`

const Title = styled.h1``

const Container = styled.div`
	width: 500px;
	padding: 40px;
`

const Footer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: end;
	gap: 30px;
	margin-top: 30px;
`

const Ul = styled.ul`
	display: flex;
	flex-direction: column;
	padding: 10px 32px;
	gap: 5px;
`
const List = styled.li`
	font-size: 16px;
	font-weight: 400;
`

const TextWarning = styled.p`
	padding: 15px 10px;
	font-size: 16px;
	font-weight: 500;
`

const WarningHeader = styled.div`
	width: 100%;
	border-left: 3px solid ${({ theme }) => theme.colors.error};
	background-color: #ffe7e4;
	border-radius: 8px;
	margin: 20px 0px;
`
