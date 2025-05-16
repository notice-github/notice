import styled, { useTheme } from 'styled-components'
import ImageWithCropper from '../../components/ImageCropper/ImageWithCropper'
import { Modals } from '../../components/Modal'
import { ProgressBar } from '../../components/ProgressBar'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SettingsCard } from '../../components/Settings/SettingCard'
import { SettingInput } from '../../components/Settings/SettingInput'
import { SettingOption } from '../../components/Settings/SettingOption'
import { useSubscription } from '../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useStorage } from '../../hooks/api/useStorage'
import { useUpdateWorkspace } from '../../hooks/api/useUpdateWorkspace'
import { useT } from '../../hooks/useT'

const amountFormatter = Intl.NumberFormat(undefined, {
	notation: 'compact',
	maximumSignificantDigits: 3,
	signDisplay: 'never',
})

const formatToken = (balance: number) => amountFormatter.format(balance).replace(/\s/g, '').toLocaleUpperCase()

export const SettingsWorkspacePage = () => {
	const [t] = useT()
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)
	const storage = useStorage(workspace.id)

	const updateWorkspace = useUpdateWorkspace()

	const updateWorkspaceIcon = async (url: string | null) => {
		updateWorkspace.mutate({ workspace: workspace, icon: url })
	}

	return (
		<>
			<Title>
				<span style={{ color: theme.colors.primaryDark }}>{workspace.name}</span> Settings
			</Title>
			<Description>{t('Manage workspace profile', 'manageWorkspaceProfile')}</Description>
			<SettingsCard title={t('Workspace Profile', 'workspaceProfile')}>
				<SettingOption
					title={t('Workspace logo', 'workspaceLogo')}
					description={t('Use a photo or image that is 64px square or larger', 'profilePictureDescription')}
					icon={
						<ImageWithCropper
							onSave={updateWorkspaceIcon}
							source="workspace"
							picture={workspace.icon}
							name={workspace.name}
						/>
					}
				></SettingOption>
				<SettingInput
					title={t('Display name', 'displayName')}
					initialValue={workspace.name}
					onUpdate={(value) => updateWorkspace.mutate({ workspace: workspace, name: value })}
					loader={updateWorkspace.isLoading}
				></SettingInput>
			</SettingsCard>

			<SettingsCard title={t('Advanced', 'advanced')}>
				<SettingOption
					title={t('Workspace deletion', 'workspaceDeletion')}
					description={
						<span>
							{t('By deleting this workspace, you delete all associated data.', 'workspaceDeletionDescription')}
						</span>
					}
				>
					<SettingButton onClick={() => Modals.deleteWorkspaceConfirmation.open({ workspace })} dangerous>
						{t('Delete workspace', 'deleteWorkspace')}
					</SettingButton>
				</SettingOption>
				<SettingOption
					title={t('Storage', 'storage')}
					description={
						<>
							{t(`(images, videos, files, ...)`, 'storageDescription')}
							<BarWrapper>
								<ProgressBar
									cursor={storage.data ?? 0}
									unit={'%'}
									color1={theme.colors.primary}
									color2={theme.colors.error}
									width={600}
								/>
								<MaxStorage>/ 100 GB</MaxStorage>
							</BarWrapper>
						</>
					}
					style={{ paddingBottom: '16px' }}
				></SettingOption>
			</SettingsCard>
		</>
	)
}

const BarWrapper = styled.div`
	padding-top: 16px;
	display: flex;
	align-items: center;
	gap: 10px;
`

const MaxStorage = styled.div`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const TokenValue = styled.p`
	font-size: 20px;
	color: ${({ theme }) => theme.colors.primary};
`

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`
