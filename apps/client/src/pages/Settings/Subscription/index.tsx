import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Loader } from '../../../components/Loader'
import { Show } from '../../../components/Show'
import { useSubscription } from '../../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useT } from '../../../hooks/useT'
import { Pages } from '../../../pages'
import SubscriptionTable from './SubscriptionTable'

const SubscriptionPage = () => {
	const [t] = useT()
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)

	useEffect(() => {
		if (!(workspace.myRole === 'admin' || workspace.myRole === 'owner')) {
			navigate(Pages.SETTINGS, { replace: true })
		}
	}, [])

	return (
		<>
			<Title>{t('Plans', 'plans')}</Title>
			<Description>
				{t('Our pricing is straightforward and aligned with your business goals.', 'pricingDescription')}
			</Description>
			<Show when={!subscription.isFetched}>
				<LoaderWrapper>
					<Loader />
				</LoaderWrapper>
			</Show>
			<Show when={subscription.isFetched}>
				<SubscriptionTable subscription={subscription.data} />
			</Show>
		</>
	)
}

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const LoaderWrapper = styled.div`
	display: flex;
	width: 100%;
	margin-top: 32px;
	align-items: center;
	justify-content: center;
`

export default SubscriptionPage
