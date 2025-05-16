import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { Notice } from '@notice-org/react'
import { IntegrationLoader } from './IntegrationLoader'
import { useLangContext } from '../../internationalisation/i18n.provider'

const Next = () => {
	const { lang = 'en' } = useLangContext()

	return (
		<>
			<IntegrationTitleBanner title={`Next Js`} icon={'/assets/svg/nextjs.svg'} />
			<Notice page="nextjs-30rxh5w1sr" lang={lang}>
				<IntegrationLoader />
			</Notice>
		</>
	)
}

export default Next
