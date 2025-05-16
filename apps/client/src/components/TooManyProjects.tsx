import styled from 'styled-components'
import { SubscribeButton } from './SubscribeButton'
import { useNavigate } from 'react-router-dom'
import { Pages } from '../pages'
import { useCurrentWorkspace } from '../hooks/api/useCurrentWorkspace'
import { useMemo } from 'react'
import { SUBSCRIPTION_DETAILS } from '../data/subscription'
import { useProjects } from '../hooks/bms/project/useProjects'

export function TooManyProjects() {
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const projects = useProjects(workspace)

	const maxProjects = useMemo(() => {
		const key = `for${workspace.subscription[0].toUpperCase()}${workspace.subscription.slice(1)}`

		let max = SUBSCRIPTION_DETAILS[0][key]
		if (typeof max !== 'number') max = 'Unlimited'

		return max
	}, [workspace.subscription])

	return (
		<Container>
			<Title>Subscription Limit Reached!</Title>
			<Description>
				Your current subscription (
				<span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{workspace.subscription}</span>) does not allow you to
				have this many projects. To continue using Notice and all its features, you must upgrade your subscription or
				delete some of your projects.
			</Description>
			<MaxCount>
				Limit reached: {projects.data?.length || 0} / {maxProjects}
			</MaxCount>
			<StyledSubscribeButton
				onClick={() => {
					navigate(Pages.SETTINGS_SUBSCRIPTION)
				}}
			>
				Upgrade my subscription
			</StyledSubscribeButton>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: center;
	width: 550px;
	padding: 32px 0;
`

const Title = styled.h1`
	font-style: normal;
	font-weight: 700;
	font-size: 26px;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
	text-align: justify;
	font-size: 15px;
	margin-top: 16px;
	margin-bottom: 32px;
`

const MaxCount = styled.p`
	font-style: normal;
	font-weight: 700;
	font-size: 16px;
	line-height: 22px;
	color: ${({ theme }) => theme.colors.error};
	margin-bottom: 16px;
	align-self: center;
`

const StyledSubscribeButton = styled(SubscribeButton)`
	align-self: center;
`
