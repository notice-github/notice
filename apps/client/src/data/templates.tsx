import {
	BlogIcon,
	CartIcon,
	DocumentIcon,
	FaqIcon,
	GetStartedIcon,
	InvestorsIcon,
	JobIcon,
	ManifestIcon,
	MegaPhoneIcon,
	MissionVisionIcon,
	PrivacyIcon,
	TermsIcon,
} from '../icons/ProjectIcons'
import { getT } from '../internationalisation'

export type TemplateList = (typeof TEMPLATE_LIST)[number]

export const TEMPLATE_CATEGORIES = [
	{ id: 'support', name: 'Support' },
	{ id: 'company', name: 'Company' },
	{ id: 'marketing', name: 'Marketing' },
	{ id: 'policies', name: 'Policies' },
] as const

export enum MIXPANEL_TYPES {
	faq = 'faq',
	blog = 'blog',
	documentation = 'documentation',
	terms = 'terms',
	privacy = 'privacy',
	article = 'article',
	jobBoard = 'jobBoard',
	eCommerceFaq = 'eCommerceFaq',
	changelog = 'changelog',
	companyReport = 'companyReport',
	investorsReport = 'investorsReport',
	helpCenter = 'helpCenter',
	getStarted = 'getStarted',
	mvv = 'mvv',
	raw = 'raw',
	tmp = 'tmp',
}

export interface NTemplate {
	id: string
	name: string
	color: string
	templateId: string
	category: string[]
	mixpanelType?: string
	icon: any
	aiGeneration: boolean
	customInstruction?: string
	customFormat?: string
	isDeep?: boolean
	generateImage?: boolean
}

export const TEMPLATE_LIST = [
	{
		id: 'documentation',
		name: 'Documentation',
		color: '#3A85D0',
		templateId: 'd9bbcd39-2e80-4dae-913f-5fe2c70baec2',
		mixpanelType: MIXPANEL_TYPES.documentation,
		icon: <DocumentIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: 'A website wants you to create 4 pages for their documentation. Give them 4 detailed ideas.',
		isDeep: true,
	},
	{
		id: 'faq',
		name: 'FAQ',
		color: '#FFB745',
		templateId: 'a53f05d6-8073-41b4-a31e-bc7f873ce1ed',
		mixpanelType: MIXPANEL_TYPES.faq,
		icon: <FaqIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: `
		You have to create 5 questions and answers for an FAQ using the data that you receive.
		Every question must address a different subject.
		Output must only be an Array with one object as shown in the example.
		Just put your 5 questions and answers in the "content" field, title shall be "FAQ".
		`,
		customFormat: `Output must be HTML. You must output the FAQ using <details> and <summary> following this format for each question:
		<details>
			<summary>[Question]</summary>
			<p>[Answer]</p>
		</details>

		Replace [Question] and [Answer].
		`,
	},
	{
		id: 'help_center',
		name: getT('Help Center', 'helpCenter'),
		color: '#FF7A92',
		templateId: 'd9c3ffb3-8280-40b9-ac46-9dd240332da7',
		mixpanelType: MIXPANEL_TYPES.helpCenter,
		icon: <ManifestIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: 'A website wants you to create 4 pages for their Help Center. Give them 4 detailed ideas.',
		isDeep: true,
	},

	{
		id: 'blog',
		name: 'Blog',
		color: '#65C985',
		templateId: '75564f47-74b6-430a-a6f7-97ca4d7a157d',
		category: ['recommended'],
		mixpanelType: MIXPANEL_TYPES.blog,
		icon: <BlogIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: 'A website wants you to create 3 fun and memorable blog articles. Give them 3 detailed ideas.',
		customFormat: 'Output must be a valid HTML and contain at least 5 paragraphs and some headings.',
		isDeep: true,
		generateImage: true,
	},
	{
		id: 'terms_of_use',
		name: getT('Terms of Use', 'termsOfuse'),
		color: '#F1A66D',
		templateId: '500ffb9c-031d-4038-af08-012ec9ef40e6',
		mixpanelType: MIXPANEL_TYPES.terms,
		icon: <TermsIcon color={'#ffffff'} />,
		aiGeneration: true,
	},

	{
		id: 'privacy_policy',
		name: getT('Privacy Policy', 'privacyPolicy'),
		color: '#C4D78E',
		templateId: 'e35d5fb8-a01a-448f-a9f7-3b330c14b776',
		mixpanelType: MIXPANEL_TYPES.privacy,
		icon: <PrivacyIcon color={'#ffffff'} />,
		aiGeneration: true,
	},

	{
		id: 'job_board',
		name: getT('Job Board', 'jobBoard'),
		color: '#777CA6',
		templateId: '1645fab7-4dff-4244-9ffc-2f0724b52b77',
		mixpanelType: MIXPANEL_TYPES.jobBoard,
		icon: <JobIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: 'A website wants you to create 3 job offers. Give them 3 detailed ideas.',
		isDeep: true,
	},
	{
		id: 'get_started',
		name: getT('Get Started', 'getStarted'),
		color: '#BF7AE4',
		templateId: 'a4229edb-ab9d-43d9-aacb-65bd4de79585',
		mixpanelType: MIXPANEL_TYPES.getStarted,
		icon: <GetStartedIcon color={'#ffffff'} />,
		aiGeneration: true,
	},
	{
		id: 'e_commerce_faq',
		name: 'E-commerce FAQ',
		color: '#A1ACBD',
		templateId: '68f973db-9167-47bb-a43b-fcf2e9794192',
		mixpanelType: MIXPANEL_TYPES.eCommerceFaq,
		icon: <CartIcon color={'#ffffff'} />,
		aiGeneration: true,
		customInstruction: `
		You have to create 5 questions and answers for an E-Commerce FAQ using the data that you receive.
		Every question must address a different aspects of e-commerce features of the data.
		Output must only be an Array with one object as shown in the example.
		Just put your 5 questions and answers in the "content" field, title shall be "E-Commerce FAQ".
		`,
		customFormat: `Output must be HTML. You must output the FAQ using <details> and <summary> following this format for each question:
		<details>
			<summary>[Question]</summary>
			<p>[Answer]</p>
		</details>

		Replace [Question] and [Answer].
		`,
	},

	{
		id: 'changelog',
		name: getT('Changelog', 'changelog'),
		color: '#659DFF',
		templateId: '8a7ceb75-6695-42f9-b0d3-c9c50a8e95ae',
		mixpanelType: MIXPANEL_TYPES.changelog,
		icon: <MegaPhoneIcon color={'#ffffff'} />,
		aiGeneration: true,
		isDeep: true,
	},

	{
		id: 'mvv',
		name: getT('Mission & Values', 'missionAndValues'),
		color: '#FF7A92',
		templateId: 'f2023da4-6148-4d48-a83a-809936789e4d',
		mixpanelType: MIXPANEL_TYPES.mvv,
		icon: <MissionVisionIcon color={'#ffffff'} />,
		aiGeneration: true,
	},

	{
		id: 'investors_report',
		name: getT('Investors Report', 'investorsReport'),
		color: '#6DC9B7',
		templateId: 'd2c582be-c231-4823-b170-05fef9af71b1',
		mixpanelType: MIXPANEL_TYPES.investorsReport,
		icon: <InvestorsIcon color={'#ffffff'} />,
		aiGeneration: true,
		isDeep: true,
	},
]
