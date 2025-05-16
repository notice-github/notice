import { WorkspaceModel } from '@notice-app/models'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import ImageWithCropper from '../../components/ImageCropper/ImageWithCropper'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SettingsCard } from '../../components/Settings/SettingCard'
import { SettingOption } from '../../components/Settings/SettingOption'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useWorkspaces } from '../../hooks/api/useWorkspaces'
import { CogIcon } from '../../icons'
import { Pages } from '../../pages'
import { useT } from '../../hooks/useT'

const dateFormater = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })

export const SettingsMyWorkspacesPage = () => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()
	const workspaces = useWorkspaces()
	const [_, setCurrentWorkspace] = useCurrentWorkspace()

	const onSettings = (workspace: WorkspaceModel.client) => {
		setCurrentWorkspace(workspace)
		navigate(Pages.SETTINGS_WORKSPACE)
	}

	return (
		<>
			<Title>{t('My Workspaces', 'myWorkspaces')}</Title>
			<Description>{t(`Manage and leave the workspaces you've joined`, 'myWorkspacesDescription')}</Description>
			<SettingsCard title={t('Workspaces', 'workspaces')}>
				{workspaces.map((workspace) => (
					<SettingOption
						key={workspace.name}
						title={workspace.name}
						description={`${t('Created', 'created')} ${dateFormater.format(workspace.createdAt)}`}
						icon={<ImageWithCropper editable={false} picture={workspace.icon} name={workspace.name} size={36} />}
					>
						<SettingButton onClick={() => onSettings(workspace)}>
							<CogIcon color={theme.colors.textDark} size={14} />
							{t('Settings', 'settings')}
						</SettingButton>
					</SettingOption>
				))}
			</SettingsCard>
		</>
	)
}

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`
