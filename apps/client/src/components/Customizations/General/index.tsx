import styled from 'styled-components'

import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { useT } from '../../../hooks/useT'
import { CustomizationSection } from '../CustomizationSection'
import { AdvancedOptions } from './AdvancedOptions'
import { HideBrandingSection } from './HideBrandingSection'
import { LogoSection } from './LogoSection'
import { HintIndexation } from './HintIndexation'

export const navigationTypes = {
	slash: { value: 'slash', name: 'Slash' },
	query: { value: 'query', name: 'Query param' },

	// memory: { value: 'memory', name: 'In memory' },
}

export const CustomizationGeneral = () => {
	const [t] = useT()
	const [onPropertyChange] = useOnPropertyChange()
	const [project] = useCurrentProject()

	const { navigationType, handlePageTitle, handleFavicon, logoUrl, stopUserTracking } = project?.preferences ?? {}
	if (!project) return
	return (
		<FlexColumn>
			<HintIndexation />
			<HideBrandingSection onPropertyChange={onPropertyChange} />
			<CustomizationSection
				title={t('Let us handle your <title /> tag', 'handleTitleTagTitle')}
				description={t(
					'When turned on notice change your page title based on the current article.',
					'titleTagDescription'
				)}
				toggled={handlePageTitle ?? false}
				onToggleChange={(value) => onPropertyChange('preferences', 'handlePageTitle', value)}
				toggleSize="sm"
			></CustomizationSection>

			<CustomizationSection
				title={t('Project Logo', 'projectLogo')}
				description={t('Logo allows you to brand your project and acts as a favicon.', 'projectLogoDescription')}
				toggleDisabled
			>
				<LogoSection hideWebsiteSections onPropertyChange={onPropertyChange} />
			</CustomizationSection>

			<CustomizationSection
				title="Favicon"
				description={
					<span>
						{t('Use your logo as your favicon when it is activated.', 'faviconDescription')}{' '}
						{!logoUrl?.length ? (
							<LogoUploadWarning>
								{t('You need to upload a project logo above to turn on this feature.', 'faviconWarning')}
							</LogoUploadWarning>
						) : (
							''
						)}
					</span>
				}
				toggled={handleFavicon ?? false}
				toggleSize="sm"
				onToggleChange={(value) => onPropertyChange('preferences', 'handleFavicon', value)}
			></CustomizationSection>
			<AdvancedOptions>
				<CustomizationSection
					title={t('Navigation type', 'navigationType')}
					description={t(
						"Use the query param `page=` to handle navigation or slash to use the classic subfolder '/'.",
						'navigationTypeDescription'
					)}
					currentValue={navigationType ?? 'slash'}
					onToggleChange={(value) => onPropertyChange('preferences', 'navigationType', value)}
					menuItems={Object.values(navigationTypes).map((type) => type)}
					sectionType="select"
				/>
			</AdvancedOptions>
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	padding: 24px;
	box-sizing: border-box;
	height: calc(100vh - ${({ theme }) => theme.modalMargin} - 85px * 2);
	overflow: auto;
`

const LogoUploadWarning = styled.span`
	color: ${({ theme }) => theme.colors.primary};
`

const WarningText = styled.span`
	color: ${({ theme }) => theme.colors.primary};
`

const TextButton = styled.span`
	text-decoration: underline;
	cursor: pointer;
`
