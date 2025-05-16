import { createBrowserRouter, NavigateOptions, To } from 'react-router-dom'

import { CustomizationCode } from './components/Customizations/Code'
import { CustomizationGeneral } from './components/Customizations/General'
import { CustomizationLayout } from './components/Customizations/Layout'
import { CustomizationStyling } from './components/Customizations/Styling'
import { EditorLayout } from './layouts/EditorLayout'
import { PortalLayout } from './layouts/PortalLayout'
import { ActivatePage } from './pages/Activate'
import { CustomisationsPage } from './pages/Customizations'
import { EditorPage } from './pages/Editor'
import { IntegrationsPage } from './pages/Integrations'
import { IntegrationViewPage } from './pages/IntegrationView'
import { InvitationPage } from './pages/Invitation'
import { OnboardingPage } from './pages/Onboarding'
import { RootPage } from './pages/Root'
import { SettingsPage } from './pages/Settings'
import { SettingsAccountPage } from './pages/Settings/Account'
import { SettingsAI } from './pages/Settings/AI'
import { SettingsAPIKeysPage } from './pages/Settings/APIKeys'
import { SettingsBillingPage } from './pages/Settings/Billing'
import { SettingsCollaboratorsPage } from './pages/Settings/Collaborators'
import { SettingsMyWorkspacesPage } from './pages/Settings/MyWorkspaces'
import SubscriptionPage from './pages/Settings/Subscription/index'
import { SubscriptionSuccess } from './pages/Settings/Subscription/SubscriptionSuccess'
import { SettingsWorkspacePage } from './pages/Settings/Workspace'
import { SigninPage } from './pages/Signin'
import { SignupPage } from './pages/Signup'
import { TranslationsPage } from './pages/Translations'
import { WebFontLoaderProvider } from './providers/WebFontLoaderProvider'

export namespace Router {
	export const _router = createBrowserRouter([
		{
			path: '/signin',
			element: <SigninPage />,
		},
		{
			path: '/signup',
			element: <SignupPage />,
		},
		{
			path: '/activate',
			element: <ActivatePage />,
		},
		{
			path: '/',
			element: <RootPage />,
			children: [
				{
					path: 'editor',
					element: (
						<EditorLayout>
							<WebFontLoaderProvider>
								<EditorPage />
							</WebFontLoaderProvider>
						</EditorLayout>
					),
					children: [
						{
							path: 'invitation',
							element: (
								<PortalLayout fullHeight={false}>
									<InvitationPage />
								</PortalLayout>
							),
						},
						{
							path: 'customization',
							element: (
								<PortalLayout>
									<CustomisationsPage />
								</PortalLayout>
							),
							children: [
								{ path: 'general', element: <CustomizationGeneral /> },
								{ path: 'styling', element: <CustomizationStyling /> },
								{ path: 'code', element: <CustomizationCode /> },
								{ path: 'layout', element: <CustomizationLayout /> },
							],
						},
						{
							path: 'translations',
							element: (
								<PortalLayout fullPage={true} paramsToUpdate={{ block: '' }}>
									<TranslationsPage />
								</PortalLayout>
							),
						},
						{
							path: 'integrations',
							element: (
								<PortalLayout>
									<IntegrationsPage />
								</PortalLayout>
							),
							children: [
								{
									path: ':id',
									element: <IntegrationViewPage />,
								},
							],
						},
						// {
						// 	path: 'insights',
						// 	element: (
						// 		<PortalLayout>
						// 			<InsightsProvider>
						// 				<InsightsPage />
						// 			</InsightsProvider>
						// 		</PortalLayout>
						// 	),
						// },
						{
							path: 'settings',
							element: (
								<PortalLayout fullPage={true}>
									<SettingsPage />
								</PortalLayout>
							),
							children: [
								{
									path: 'account',
									element: <SettingsAccountPage />,
								},
								{
									path: 'my-workspaces',
									element: <SettingsMyWorkspacesPage />,
								},
								{
									path: 'notice-ai',
									element: <SettingsAI />,
								},
								{
									path: 'api-keys',
									element: <SettingsAPIKeysPage />,
								},
								{
									path: 'workspace',
									element: <SettingsWorkspacePage />,
								},
								{
									path: 'collaborators',
									element: <SettingsCollaboratorsPage />,
								},
								{
									path: 'subscription',
									element: <SubscriptionPage />,
								},
								{
									path: 'billing',
									element: <SettingsBillingPage />,
								},
							],
						},
						{
							path: 'subscription-success',
							element: (
								<PortalLayout fullHeight={false}>
									<SubscriptionSuccess />
								</PortalLayout>
							),
						},
					],
				},
			],
		},
	])

	// Original navigate method
	const _navigate = _router.navigate.bind({})

	// Wrapped navigate method that always keep search params
	_router.navigate = (to: To | number, options?: NavigateOptions) => {
		if (typeof to === 'number') return _navigate(to)

		const { location } = _router.state

		let path: string

		if (typeof to === 'string') {
			path = to + (options?.state?.clear === true ? '' : location.search)
		} else {
			const toParams = new URLSearchParams(to.search ?? '')

			if (options?.state?.clear !== true) {
				const currParams = new URLSearchParams(location.search)
				for (const [key, value] of currParams.entries()) {
					if (!toParams.has(key)) toParams.append(key, value)
				}
			}

			Array.from(toParams.entries())
				.filter(([, value]) => !value || value === 'undefined')
				.forEach(([key]) => toParams.delete(key))

			path = `${to.pathname}?${toParams.toString()}`
		}

		_navigate(path, options)
	}
}
