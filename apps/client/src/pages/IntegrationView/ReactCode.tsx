import { Notice } from '@notice-org/react'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { IntegrationLoader } from './IntegrationLoader'
import { useLangContext } from '../../internationalisation/i18n.provider'

const ReactCode = () => {
	const { lang = 'en' } = useLangContext()

	return (
		<>
			<IntegrationTitleBanner title={`React`} icon={'/assets/svg/react.svg'} />
			<Notice page="react-4ht4jx5scm" lang={lang}>
				<IntegrationLoader />
			</Notice>
		</>
	)
}

export default ReactCode
