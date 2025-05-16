import { useEffect } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { Page } from '../../components/Page'
import { PageBody } from '../../components/Page/PageBody'
import { PageContent } from '../../components/Page/PageContent'
import { PageHead, PageHeadIcon, PageHeadTitle } from '../../components/Page/PageHead'
import { PageSide } from '../../components/Page/PageSide'
import { Show } from '../../components/Show'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../hooks/api/useUser'
import { useT } from '../../hooks/useT'
import { AIIcon, CogIcon } from '../../icons'
import { GroupIcon } from '../../icons/GroupIcon'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { SubscriptionIcon } from '../../icons/SubscriptionIcon'
import { WorkspaceIcon } from '../../icons/WorkspaceIcon'
import { Pages } from '../../pages'

export const SettingsPage = () => {
	const [t] = useT()
	const outlet = useOutlet()
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const trackEvent = useTrackEvent()
	const user = useUser()
	const [workspace] = useCurrentWorkspace()

	useEffect(() => {
		if (pathname === Pages.SETTINGS) {
			navigate(Pages.SETTINGS_ACCOUNT, { replace: true })
		}
	}, [pathname])

	return (
		<Page minWidth="1080px">
			<PageSide>
				<PageHead>
					<PageHeadIcon src="/assets/svg/setting.svg" />
					<PageHeadTitle>{t('Settings', 'settings')}</PageHeadTitle>
				</PageHead>
				<PageBody>
					<MenuTitle>{t('Account', 'account')}</MenuTitle>
					<MenuItem selected={pathname === Pages.SETTINGS_ACCOUNT} onClick={() => navigate(Pages.SETTINGS_ACCOUNT)}>
						<CogIcon size={18} />
						{t('Settings', 'settings')}
					</MenuItem>
					<MenuItem
						selected={pathname === Pages.SETTINGS_MY_WORKSPACES}
						onClick={() => navigate(Pages.SETTINGS_MY_WORKSPACES)}
					>
						<WorkspaceIcon size={20} />
						{t('My Workspaces', 'myWorkspaces')}
					</MenuItem>
				</PageBody>
				<Separator />
				<PageBody style={{ paddingBottom: '8px' }}>
					<MenuTitle>{t('Workspace', 'workspace')}</MenuTitle>
					<MenuItem selected={pathname === Pages.SETTINGS_WORKSPACE} onClick={() => navigate(Pages.SETTINGS_WORKSPACE)}>
						<CogIcon size={18} />
						{t('Settings', 'settings')}
					</MenuItem>
					<MenuItem
						selected={pathname === Pages.SETTINGS_NOTICE_IA}
						onClick={() => navigate(Pages.SETTINGS_NOTICE_IA)}
						noSvgFill
					>
						<AIIcon size={18} />
						{t('AI Settings', 'aiSettings')}{' '}
					</MenuItem>
					<MenuItem
						selected={pathname === Pages.SETTINGS_COLLABORATORS}
						onClick={() => navigate(Pages.SETTINGS_COLLABORATORS)}
					>
						<GroupIcon size={20} />
						{t('Collaborators', 'collaborators')}
					</MenuItem>
					{/* <Show when={workspace.myRole === 'admin' || workspace.myRole === 'owner'}>
						<MenuItem
							selected={pathname === Pages.SETTINGS_SUBSCRIPTION}
							onClick={() => {
								navigate(Pages.SETTINGS_SUBSCRIPTION)
							}}
						>
							<RocketLaunch size={20} />
							{workspace.subscription !== 'free' ? t('Plans', 'plans') : t('Upgrade', 'upgrade')}
						</MenuItem>
					</Show> */}
					<Show
						when={workspace.subscription !== 'free' && (workspace.myRole === 'admin' || workspace.myRole === 'owner')}
					>
						<MenuItem selected={pathname === Pages.SETTINGS_BILLING} onClick={() => navigate(Pages.SETTINGS_BILLING)}>
							<SubscriptionIcon size={20} />
							{t('Billing', 'billing')}
						</MenuItem>
					</Show>
				</PageBody>
			</PageSide>
			<PageContent>{outlet}</PageContent>
		</Page>
	)
}

const MenuTitle = styled.h2`
	display: flex;
	align-items: center;
	gap: 8px;

	font-weight: 800;
	font-size: 24px;
	margin-bottom: 6px;
`

const MenuItem = styled.div<{ selected?: boolean; noSvgFill?: boolean }>`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	margin: 4px 0px;

	font-size: 15px;
	font-weight: 600;

	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ selected, theme }) => (selected ? theme.colors.hover : undefined)};
	color: ${({ selected, theme }) => (selected ? theme.colors.primary : undefined)};
	transition: all 0.1s ease;

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
		color: ${({ theme }) => theme.colors.primary};
	}

	${({ noSvgFill, selected }) =>
		noSvgFill
			? css`
					svg {
						stroke: ${({ theme }) => (selected ? theme.colors.primary : theme.colors.textDark)};
					}
					&:hover {
						svg {
							stroke: ${({ theme }) => theme.colors.primary};
						}
					}
			  `
			: css`
					svg {
						fill: ${({ theme }) => (selected ? theme.colors.primary : theme.colors.textDark)};
					}

					&:hover {
						svg {
							fill: ${({ theme }) => theme.colors.primary};
						}
					}
			  `}
`

const Separator = styled.div`
	width: 100%;
	height: 2px;
	background-color: ${({ theme }) => theme.colors.borderLight};
`
