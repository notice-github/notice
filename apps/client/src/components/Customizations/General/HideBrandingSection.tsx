import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useUser } from '../../../hooks/api/useUser'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { useT } from '../../../hooks/useT'
import { CustomizationSection } from '../CustomizationSection'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const HideBrandingSection = ({ onPropertyChange }: Props) => {
	const [t] = useT()
	const [project] = useCurrentProject()
	const trackEvent = useTrackEvent()
	const user = useUser()

	return (
		<CustomizationSection
			title={t('Hide branding', 'hideBranding')}
			description={t("When turned on 'Created with notice' will be hidden.", 'hideBrandingDescription')}
			toggled={project?.preferences?.hideNoticePoweredBy ?? false}
			onToggleChange={(value) => {
				onPropertyChange('preferences', 'hideNoticePoweredBy', value)
			}}
			toggleSize="sm"
			paidFeature
		></CustomizationSection>
	)
}
