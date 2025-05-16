import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Integration } from '../../data/integrations'
import { HTMLIntegration } from './HTML'
import IFrame from './IFrame'
import Link from './Link'
import Next from './Next'
import Nuxt from './Nuxt'
import Qrcode from './Qrcode'
import ReactCode from './ReactCode'
import { RestAPI } from './RestAPI'
import Shopify from './Shopify'
import { Squarespace } from './Squarespace'
import { Umso } from './Umso'
import Unicorn from './Unicorn'
import Vue from './Vue'
import { WebflowIntegration } from './Webflow'
import Wix from './Wix'
import { WordpressIntegration } from './Wordpress'

export const IntegrationViewPage = () => {
	const integration = useIntegration()

	return <Container>{integration}</Container>
}

const useIntegration = () => {
	const { id } = useParams<{ id: Integration['id'] }>()

	switch (id) {
		case 'webflow':
			return <WebflowIntegration />
		case 'wordpress':
			return <WordpressIntegration />
		case 'html':
			return <HTMLIntegration />
		case 'shopify':
			return <Shopify />
		case 'umso':
			return <Umso />
		case 'unicorn':
			return <Unicorn />
		case 'wix':
			return <Wix />
		case 'squarespace':
			return <Squarespace />
		case 'api':
			return <RestAPI />
		case 'qrcode':
			return <Qrcode />
		case 'link':
			return <Link />
		case 'react':
			return <ReactCode />
		case 'nextjs':
			return <Next />
		case 'nuxt':
			return <Nuxt />
		case 'vuejs':
			return <Vue />
		case 'iframe':
			return <IFrame />
	}
}

const Container = styled.div`
	width: 745px;
`
