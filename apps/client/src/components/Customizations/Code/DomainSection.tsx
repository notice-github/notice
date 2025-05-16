import styled, { useTheme } from 'styled-components'

import { NEnv } from '@notice-app/utils'
import { darken } from 'polished'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { useT } from '../../../hooks/useT'
import { CrossIcon } from '../../../icons'
import { EditIcon } from '../../../icons/EditIcon'
import { OpenIcon } from '../../../icons/OpenIcon'
import { Modals } from '../../Modal'
import { SettingButton } from '../../Settings/SettingButton'
import { CustomizationSection } from '../CustomizationSection'

interface Props {}

/**
 * /!\ IMPORTANT /!\
 *
 * If you need to change something here, that is not simply text.
 * Please, tell me (jonas.roussel@notice.studio) before.
 * This component is very sensitive to changes and can break at the slightest change.
 */
export const DomainSection = ({}: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()

	return (
		<CustomizationSection
			title={t('Custom Domain', 'customDomain')}
			paidFeature
			forPlans={['essential', 'teams', 'enterprise']}
		>
			<Container>
				<Description>
					{t('Add your own custom domain and link it to your project.', 'customDomainDescription')}
				</Description>
				<ConfigureContainer>
					{project?.preferences?.customDomain && (
						<>
							{t(`You currently don't have a custom domain link to this project`, 'customDomainMissing')}
							<ButtonGroup>
								<LinkCard link={project.preferences.customDomain} />
								<SettingButton
									onClick={() => Modals.domainConfiguration.open()}
									disabled={workspace.subscription === 'free'}
								>
									<EditIcon size={14} color={theme.colors.dark} />
								</SettingButton>
								<SettingButton onClick={() => Modals.deleteDomainConfirmation.open({ project })}>
									<CrossIcon size={12} color={theme.colors.error} />
								</SettingButton>
							</ButtonGroup>
						</>
					)}
					{!project?.preferences?.customDomain && (
						<>
							You currently haven't set up any custom domain.
							<SettingButton
								onClick={() => Modals.domainConfiguration.open()}
								disabled={workspace.subscription === 'free'}
								primary
							>
								Configure
							</SettingButton>
						</>
					)}
				</ConfigureContainer>
			</Container>
		</CustomizationSection>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`

const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const ConfigureContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;

	padding: 12px;

	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};
	border-radius: ${({ theme }) => theme.borderRadius};
`

const ButtonGroup = styled.div`
	display: flex;
	align-self: stretch;
	gap: 8px;
`

const LinkCard = ({ link }: { link: string }) => {
	const theme = useTheme()

	return (
		<Card onClick={() => window.open(`https://${link}` + (NEnv.STAGE === 'staging' ? '?stage=staging' : ''), '_blank')}>
			<span>{link}</span>
			<OpenIcon size={16} color={theme.colors.grey} />
		</Card>
	)
}

const Card = styled.div`
	flex: 1;

	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 8px 16px;

	color: ${({ theme }) => theme.colors.primary};

	background-color: ${({ theme }) => theme.colors.white};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => darken(0.025, theme.colors.white)};
	}
`
