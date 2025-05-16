import { getT } from '../internationalisation'

export type IntegrationCategory = (typeof INTEGRATION_CATEGORIES)[number]['id']

export type Integration = {
	id: (typeof INTEGRATIONS)[number]['id']
	name: string
	icon: string
	description: string
	categories: IntegrationCategory[]
}

export const INTEGRATION_CATEGORIES = [
	{ id: 'cms', name: 'CMS' },
	{ id: 'framework', name: 'Frameworks' },
	{ id: 'shareable', name: getT('Shareables', 'shareables') },
	{ id: 'other', name: getT('Others', 'others') },
] as const

export const INTEGRATIONS = [
	{
		id: 'webflow',
		name: 'Webflow',
		icon: '/assets/svg/webflow.svg',
		description: getT('Add Notice blocks to your Webflow website in a single click.', 'webflowIntegration'),
		categories: ['cms'],
	},
	{
		id: 'wordpress',
		name: 'Wordpress',
		icon: '/assets/svg/wordpress.svg',
		description: getT('Add Notice Plugin to empower your experience on Wordpress.', 'wordpressIntegration'),
		categories: ['cms'],
	},
	{
		id: 'shopify',
		name: 'Shopify',
		icon: '/assets/svg/shopify.svg',
		description: getT('Deliver great customer experience by using Notice Plugin in your store.', 'shopifyIntegration'),
		categories: ['cms'],
	},
	{
		id: 'umso',
		name: 'Umso',
		icon: '/assets/svg/umso.svg',
		description: getT('Add Notice blocks to Umso website and get insights from your audience.', 'umsoIntegration'),
		categories: ['cms'],
	},
	{
		id: 'unicorn',
		name: 'Unicorn',
		icon: '/assets/svg/unicorn.svg',
		description: getT('Quick win to improve and personalize your website with smart blocks.', 'unicornIntegration'),
		categories: ['cms'],
	},
	{
		id: 'wix',
		name: 'Wix',
		icon: '/assets/svg/wix.svg',
		description: getT(
			'Having Notice inside Wix is easy. Just add an embed block and integration is done!',
			'wixIntegration'
		),
		categories: ['cms'],
	},
	{
		id: 'squarespace',
		name: 'Squarespace',
		icon: '/assets/svg/square.svg',
		description: getT(
			`It's fast, as usual. Add a code block and paste your Notice ID to have your content ON.`,
			'squarespaceIntegration'
		),
		categories: ['cms'],
	},
	{
		id: 'react',
		name: 'React',
		icon: '/assets/svg/react.svg',
		description: getT('Notice blocks easily integrated into React in just one step.', 'reactIntegration'),
		categories: ['framework'],
	},
	{
		id: 'nextjs',
		name: 'Next.js',
		icon: '/assets/svg/nextjs.svg',
		description: getT('For the lovers of the Next.js SSR frontend framework, smooth integration.', 'nextIntegration'),
		categories: ['framework'],
	},
	{
		id: 'vuejs',
		name: 'Vue.js',
		icon: '/assets/svg/vuejs.svg',
		description: getT('Integrate Notice inside your Vue.js project in less than one minute.', 'vueIntegration'),
		categories: ['framework'],
	},
	{
		id: 'nuxt',
		name: 'Nuxt',
		icon: '/assets/svg/nuxt.svg',
		description: getT('For the lovers of the Nuxt SSR frontend framework, smooth integration.', 'nuxtIntegration'),
		categories: ['framework'],
	},
	{
		id: 'link',
		name: 'Link',
		icon: '/assets/svg/link.svg',
		description: getT("The easiest solution, just share the link! You don't even need a website.", 'linkIntegration'),
		categories: ['shareable', 'other'],
	},
	{
		id: 'html',
		name: 'HTML <script> tag',
		icon: '/assets/svg/html.svg',
		description: getT("The go-to solution for websites if you don't find your specific framework.", 'htmlIntegration'),
		categories: ['other'],
	},
	{
		id: 'iframe',
		name: 'iFrame',
		icon: '/assets/svg/iframe.svg',
		description: getT('Easy to use, iframes fit everywhere, even in mobile application.', 'iframeIntegration'),
		categories: ['other'],
	},
	{
		id: 'api',
		name: 'REST API',
		icon: '/assets/svg/rawjson.svg',
		description: getT('For advanced users that want total control over their projects.', 'rawJSONIntegration'),
		categories: ['other'],
	},
	{
		id: 'qrcode',
		name: 'QR Code',
		icon: '/assets/svg/qrcode.svg',
		description: getT('Your content at users fingertips! Share your own QR code :)', 'qrcodeIntegration'),
		categories: ['shareable', 'other'],
	},
] as const
