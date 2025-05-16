import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styled from 'styled-components'

import { NUrls } from '@notice-app/utils'
import ImageWithCropper from '../../components/ImageCropper/ImageWithCropper'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SettingsCard } from '../../components/Settings/SettingCard'
import { SettingInput } from '../../components/Settings/SettingInput'
import { SettingOption } from '../../components/Settings/SettingOption'
import { useUnlinkAuthMethod } from '../../hooks/api/useUnlinkAuthMethod'
import { useUpdateUser } from '../../hooks/api/useUpdateUser'
import { useUser } from '../../hooks/api/useUser'
import { useSearchParam } from '../../hooks/useSearchParam'
import { GithubIcon, GoogleIcon } from '../../icons'
import { EmailIcon } from '../../icons/EmailIcon'
import { API } from '../../utils/query'
import { SettingDropdown } from '../../components/Settings/SetingDropdown'
import { LangKeys, dictionaries, getCurrentLang, setAppLangCookie } from '../../internationalisation'
import { useT } from '../../hooks/useT'
import { useLangContext } from '../../internationalisation/i18n.provider'

const ERROR_MESSAGE: { [key: string]: string } = {
	google_already_linked:
		'You cannot link this Google account because it is already linked to another Notice account. Please unlink it first and then try again.',
	github_already_linked:
		'You cannot link this Github account because it is already linked to another Notice account. Please unlink it first and then try again.',
	unknown_error:
		'An unknown error has occurred during the request. Try to refresh the page. If the issue persists, please contact us.',
}

export const SettingsAccountPage = () => {
	const [t] = useT()
	const user = useUser()
	const updateUser = useUpdateUser()
	const unlinkAuthMethod = useUnlinkAuthMethod()
	const [error, setError] = useSearchParam('error')
	const { lang, setLangCtx } = useLangContext()

	useEffect(() => {
		if (!error) return

		if (!toast.isActive(error)) {
			toast.error(ERROR_MESSAGE[error] ?? error, { toastId: error })
			setError(null)
		}
	}, [])

	const onSignOut = async () => {
		await API.post('/auth/disconnect')
		window.location.href = '/signin'
	}

	const handleUploadSave = (url: string | null) => {
		updateUser.mutate({ picture: url })
	}

	return (
		<>
			<Title>{t('Account Settings', 'accountSettings')}</Title>
			<Description>
				{t('Manage your profile, preferences, and login settings', 'accountSettingsDescription')}
			</Description>
			<SettingsCard title={t('Your Profile', 'yourProfile')}>
				<SettingOption
					title={t('Profile picture', 'profilePicture')}
					description={t('Use a an image that is 64px square or larger', 'profilePictureDescription')}
					icon={
						<ImageWithCropper onSave={handleUploadSave} source="user" picture={user.picture} name={user.username} />
					}
				></SettingOption>
				<SettingInput
					title={t('Full name', 'fullName')}
					initialValue={user.username}
					onUpdate={(value) => updateUser.mutate({ username: value })}
					loader={updateUser.isLoading}
				></SettingInput>
				<div>
					<Title3>{t('Dashboard language', 'dashboardLanguage')}</Title3>
					<SettingDropdown
						values={Object.keys(dictionaries)}
						currentValue={lang}
						displayName={(value) => {
							switch (value) {
								case 'fr':
									return 'French'
								case 'en':
									return 'English'
								case 'pt':
									return 'Portuguese'
								case 'es':
									return 'Spanish'
								case 'ko':
									return 'Korean'
								case 'it':
									return 'Italian'
								case 'ja':
									return 'Japanese'
								case 'de':
									return 'German'
								case 'zhTW':
									return 'Chinese (Traditional)'
								case 'zh':
									return 'Chinese (Simplified)'
								default:
									return 'English'
							}
						}}
						displayIcon={(value) => {
							switch (value) {
								case 'fr':
									return <div>🇫🇷</div>
								case 'en':
									return <div>🇺🇸</div>
								case 'pt':
									return <div>🇧🇷</div>
								case 'es':
									return <div>🇪🇸</div>
								case 'ko':
									return <div>🇰🇷</div>
								case 'it':
									return <div>🇮🇹</div>
								case 'ja':
									return <div>🇯🇵</div>
								case 'de':
									return <div>🇩🇪</div>
								case 'zhTW':
								case 'zh':
									return <div>🇨🇳</div>
								default:
									return <div>🇺🇸</div>
							}
						}}
						// @ts-ignore
						onUpdate={(value: LangKeys) => {
							setAppLangCookie(value)
							setLangCtx(value)
							setTimeout(() => {
								window.location.reload()
							}, 100)
						}}
					/>
				</div>
			</SettingsCard>
			<SettingsCard title={t('Sign In methods', 'signInMethods')}>
				<SettingOption
					title="Email"
					description={t('Update the email used to log into your account', 'signInMethodsDescription')}
					icon={<EmailIcon />}
				>
					<SettingButton onClick={() => toast.info(t('This feature is coming soon...', 'featureComingSoon'))}>
						{t('Update email', 'updateEmail')}
					</SettingButton>
				</SettingOption>
				<SettingOption
					title="Google"
					description={t('Set up a single sign-on with Google and login with one click', 'signOnWithGoogle')}
					icon={<GoogleIcon />}
				>
					<SettingButton
						dangerous={user.googleId != null}
						loader={unlinkAuthMethod.variables?.provider === 'google' && unlinkAuthMethod.isLoading}
						onClick={async () => {
							if (user.googleId != null) {
								await unlinkAuthMethod.mutateAsync({ provider: 'google' })
								toast.success(
									t(
										'Your Google account has been successfully unlinked from your account.',
										'yourGoogleAccountHasBeenUnlinked'
									)
								)
							} else {
								window.location.href = `${NUrls.App.api()}/auth/google/link?next=${encodeURIComponent(
									window.location.pathname + window.location.search
								)}`
							}
						}}
					>
						{user.googleId != null ? t('Unlink account', 'unlinkAccount') : t('Link account', 'linkAccount')}
					</SettingButton>
				</SettingOption>
				<SettingOption
					title="Github"
					description={t('Set up a single sign-on with Github and login with one click', 'singleSignOnGithub')}
					icon={<GithubIcon color="black" />}
				>
					<SettingButton
						dangerous={user.githubId != null}
						loader={unlinkAuthMethod.variables?.provider === 'github' && unlinkAuthMethod.isLoading}
						onClick={async () => {
							if (user.githubId != null) {
								await unlinkAuthMethod.mutateAsync({ provider: 'github' })
								toast.success(
									t(
										'Your Github account has been successfully unlinked from your account.',
										'githubAccountHasBeenUnlinked'
									)
								)
							} else {
								window.location.href = `${NUrls.App.api()}/auth/github/link?next=${encodeURIComponent(
									window.location.pathname + window.location.search
								)}`
							}
						}}
					>
						{user.githubId != null ? t('Unlink account', 'unlinkAccount') : t('Link account', 'linkAccount')}
					</SettingButton>
				</SettingOption>
			</SettingsCard>
			<SettingsCard title="Advanced">
				<SettingOption
					title={t('Signing out', 'signOut')}
					description={t(
						'You can safely sign out from the current sessions and choose to sign in back later',
						'signOutDescription'
					)}
				>
					<SettingButton onClick={onSignOut}>Sign out</SettingButton>
				</SettingOption>
				<SettingOption
					title={t('Account deletion', 'accountDeletion')}
					description={
						<span>
							{t('By deleting your personnal account, you delete all associated data.', 'accountDeletionDescription')}
						</span>
					}
				>
					<DeleteButton
						onClick={() => {
							const subject = t('Delete my account', 'deleteMyAccountSubject')
							const body = t('Hi, I want to delete my account', 'deleteMyAccountBody')
							window.location.href = `mailto:mail@example.org?subject=${subject}&body=${body}`
						}}
					>
						{t('Delete account', 'deleteAccount')}
					</DeleteButton>
				</SettingOption>
			</SettingsCard>
		</>
	)
}

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const DeleteButton = styled.button`
	border: none;
	color: ${({ theme }) => theme.colors.textDark};
	background: transparent;
	text-decoration: underline;
`

const Title3 = styled.h3`
	font-size: 17px;
	font-weight: 500;
	margin-left: 2px;
	margin-bottom: 6px;
`
