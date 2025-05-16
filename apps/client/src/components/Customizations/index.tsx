import styled from 'styled-components'

import { Outlet, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { useSubscription } from '../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useT } from '../../hooks/useT'
import { Pages } from '../../pages'
import { UpgradeButton } from '../UpgradeButton'
import { CustomizationTab } from './CustomizationTab'

export const CustomizationTabs = () => {
	const [t] = useT()
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)

	return (
		<TabContainer>
			<TabBar>
				<CustomizationTab
					title={t('General', 'general')}
					selected={!!matchPath(Pages.CUSTOMIZATION_GENERAL, pathname)}
					onClick={() => {
						navigate(Pages.CUSTOMIZATION_GENERAL)
					}}
				/>
				<CustomizationTab
					title={t('Layout', 'layout')}
					selected={!!matchPath(Pages.CUSTOMIZATION_LAYOUT, pathname)}
					onClick={() => navigate(Pages.CUSTOMIZATION_LAYOUT)}
				/>
				<CustomizationTab
					title={t('Styling', 'styling')}
					selected={!!matchPath(Pages.CUSTOMIZATION_STYLING, pathname)}
					onClick={() => navigate(Pages.CUSTOMIZATION_STYLING)}
				/>
				<CustomizationTab
					title={t('Code', 'code')}
					selected={!!matchPath(Pages.CUSTOMIZATION_CODE, pathname)}
					onClick={() => navigate(Pages.CUSTOMIZATION_CODE)}
				/>
			</TabBar>
			<TabContent>
				<Outlet />
			</TabContent>
		</TabContainer>
	)
}

const TabBar = styled.div`
	display: flex;
	justify-content: space-evenly;
	padding-top: 4px;
	margin-right: 8px;
	border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
	width: 100%;
	overflow: auto;
`

const TabContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: white;
	width: 100%;
	height: 100%;
`

const TabContent = styled.div`
	width: 450px;
`

const StyledUpgradeButton = styled(UpgradeButton)`
	position: absolute;
	top: calc(50% - 15px);
	left: calc(50% - 60px);
	width: 120px;
	height: 30px;
	z-index: 4;
`
