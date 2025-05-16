import { SignPageContainer } from '../../containers/SignPageContainer'
import { Pages } from '../../pages'

export const SignupPage = () => {
	return (
		<SignPageContainer
			title="Sign Up"
			description=""
			switchLink={Pages.SIGNIN}
			switchText="Sign In"
			rescueLink={true}
		/>
	)
}
