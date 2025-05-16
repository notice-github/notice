import { Notice } from '@notice-org/react'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { IntegrationLoader } from './IntegrationLoader'
import { useLangContext } from '../../internationalisation/i18n.provider'

const Vue = () => {
	const { lang = 'en' } = useLangContext()
	return (
		<>
			<IntegrationTitleBanner title={`Vue JS`} icon={'/assets/svg/vuejs.svg'} />
			<Notice page="vuejs-qbp1l9mcqd" lang={lang}>
				<IntegrationLoader />
			</Notice>
		</>
	)
}

export default Vue
