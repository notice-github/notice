import styled from 'styled-components'
import { Page } from '../../components/Page'
import { PageContent } from '../../components/Page/PageContent'
import { PageHead, PageHeadDescription, PageHeadIcon, PageHeadTitle } from '../../components/Page/PageHead'
import { PageSide } from '../../components/Page/PageSide'
import { UpgradeButton } from '../../components/UpgradeButton'
import { useSubscription } from '../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { Pages } from '../../pages'
import Visits from './Visits'
import { useT } from '../../hooks/useT'

export const InsightsPage = () => {
	const [t] = useT()

	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)
	const limitedBySubscription = subscription.isFetched && !subscription.data

	return (
		<>
			{limitedBySubscription && (
				<StyledUpgradeButton to={Pages.SETTINGS_SUBSCRIPTION}>
					<RocketLaunch color="white" size={26} />
					{t('Upgrade', 'upgrade')}
				</StyledUpgradeButton>
			)}

			<StyledPage minWidth="1230px" shouldBlur={limitedBySubscription}>
				<PageSide>
					<PageHead>
						<PageHeadIcon src="/assets/svg/insights.svg" />
						<PageHeadTitle>{t('Insights', 'insights')}</PageHeadTitle>
						<PageHeadDescription>
							{t('Drive content strategy and improve customer support with data on user behavior.', 'insightsDesc')}
						</PageHeadDescription>
					</PageHead>
				</PageSide>
				<PageContent>
					<Visits />
				</PageContent>
			</StyledPage>
		</>
	)
}

const StyledPage = styled(Page)<{ shouldBlur: boolean }>`
	filter: ${({ shouldBlur }) => (shouldBlur ? 'blur(10px)' : 'none')};
	pointer-events: ${({ shouldBlur }) => (shouldBlur ? 'none' : 'auto')};
	user-select: none;
`

const StyledUpgradeButton = styled(UpgradeButton)`
	position: absolute;
	top: calc(50% - 25px);
	left: calc(50% - 100px);
	width: 200px;
	height: 50px;
	z-index: 4;
	font-size: 21px;
`
