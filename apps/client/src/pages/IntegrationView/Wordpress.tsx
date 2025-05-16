import { Notice } from '@notice-org/react'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { IntegrationLoader } from './IntegrationLoader'
import { useLangContext } from '../../internationalisation/i18n.provider'

export const WordpressIntegration = () => {
	const { lang = 'en' } = useLangContext()

	return (
		<>
			<IntegrationTitleBanner title={'WordPress'} icon={'/assets/svg/wordpress.svg'} />
			<Notice page="wordpress-g7dqh4j15j" lang={lang}>
				<IntegrationLoader />
			</Notice>
		</>
	)
}
