export namespace Pages {
	export const ROOT = '/'

	export const SIGNIN = '/signin'
	export const SIGNUP = '/signup'
	export const FORGOT_PASSWORD = '/forgot'

	export const EDITOR = '/editor'
	export const WELCOME = '/editor/welcome'

	export const TRANSLATIONS = `${EDITOR}/translations`
	export const INTEGRATIONS = `${EDITOR}/integrations`

	export const CUSTOMIZATION = `${EDITOR}/customization`
	export const CUSTOMIZATION_GENERAL = `${CUSTOMIZATION}/general`
	export const CUSTOMIZATION_STYLING = `${CUSTOMIZATION}/styling`
	export const CUSTOMIZATION_LAYOUT = `${CUSTOMIZATION}/layout`
	export const CUSTOMIZATION_CODE = `${CUSTOMIZATION}/code`
	export const CUSTOMIZATION_TRANSLATION = `${CUSTOMIZATION}/translation`

	export const INTEGRATION_VIEW = (id: string) => `${INTEGRATIONS}/${id}`

	export const SETTINGS = `${EDITOR}/settings`
	export const SETTINGS_ACCOUNT = `${SETTINGS}/account`
	export const SETTINGS_MY_WORKSPACES = `${SETTINGS}/my-workspaces`
	export const SETTINGS_API_KEYS = `${SETTINGS}/api-keys`
	export const SETTINGS_WORKSPACE = `${SETTINGS}/workspace`
	export const SETTINGS_COLLABORATORS = `${SETTINGS}/collaborators`
	export const SETTINGS_SUBSCRIPTION = `${SETTINGS}/subscription`
	export const SETTINGS_NOTICE_IA = `${SETTINGS}/notice-ai`
	export const SETTINGS_BILLING = `${SETTINGS}/billing`

	// export const INSIGHTS = `${EDITOR}/insights`
	// export const INSIGHTS_VISITS = `${INSIGHTS}/visits`
	// export const INSIGHTS_SEARCHES = `${INSIGHTS}/searches`

	export const SUBSCRIPTION_SUCCESS = `${EDITOR}/subscription-success`
}
