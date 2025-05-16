import { SignPageContainer } from '../../containers/SignPageContainer'
import { useT } from '../../hooks/useT'
import { Pages } from '../../pages'

export const SigninPage = () => {
	const [t] = useT()
	return (
		<SignPageContainer
			title={t('Sign In', 'signIn')}
			description={t('Sign in quickly using one of your social accounts, or use your work email.', 'signInDescription')}
			switchLink={Pages.SIGNUP}
			switchText={t('Sign Up', 'signUp')}
		/>
	)
}
