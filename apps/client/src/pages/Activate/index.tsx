import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { NUrls } from '@notice-app/utils'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { SignInInput } from '../../components/SignInInput'
import { useResendCode } from '../../hooks/api/auth/useResendCode'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Pages } from '../../pages'
import { queryClient } from '../../utils/query'

export const ActivatePage = () => {
	const navigate = useNavigate()
	const [emailParam] = useSearchParam('email')

	const [email, setEmail] = useState(emailParam ?? '')
	const [code, setCode] = useState('')
	const [inProgress, setInProgress] = useState(false)

	const resendCode = useResendCode()

	const signInWithCode = async () => {
		if (inProgress) return
		setInProgress(true)

		try {
			const res = await axios.post(
				`${NUrls.App.api()}/auth/email?source=${window.location.pathname}`,
				{
					email: email.trim(),
					code: code.trim(),
				},
				{ withCredentials: true }
			)

			if (res.data.success) {
				await queryClient.refetchQueries()
				navigate(Pages.EDITOR)
			}
		} catch (ex) {
			toast.error('Wrong activation code')
		}

		setInProgress(false)
	}

	return (
		<Container>
			<FormWrapper>
				<Form>
					<FormLogo src="https://assets.notice.studio/branding/logo.png" />
					<FormTitle>Activation</FormTitle>
					<FormDescription>
						Your account is almost ready, you just need to confirm your email to activate your account
					</FormDescription>
					<StyledSignInInput
						type="email"
						placeholder="Enter work email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={emailParam != null}
					/>
					<SecondaryText style={{ marginTop: '16px', marginBottom: '24px' }}>
						We just sent you an activation code by email.
						<br />
						Please check your inbox.
						<br />
						{!resendCode.isSuccess && (
							<ResendLink
								onClick={async () => {
									if (resendCode.isLoading || resendCode.isSuccess) return

									try {
										await resendCode.mutateAsync({ email: email.trim() })
										toast.success('Code successfully sent, it should arrive in your mailbox within a minute.')
									} catch (ex) {
										toast.error('An error occurred while sending the code, please try again in 60 seconds.')
									}
								}}
							>
								Resend code
							</ResendLink>
						)}
					</SecondaryText>
					<SignInInput
						type="text"
						placeholder="Enter temporary code"
						value={code}
						onKeyDown={(e) => {
							if (e.key === 'Enter') signInWithCode()
						}}
						onChange={(e) => setCode(e.target.value)}
						autoFocus
					/>
					<Button style={{ marginTop: '16px' }} onClick={signInWithCode} loader={inProgress}>
						Activate
					</Button>
				</Form>
			</FormWrapper>
			<SideImage src="https://assets.notice.studio/editor/login-background.png" />
		</Container>
	)
}

const Container = styled.div`
	display: flex;

	width: 100%;
	height: 100vh;
`

const FormWrapper = styled.div`
	position: relative;

	flex: 1;

	display: flex;
	align-items: center;
	justify-content: center;

	height: 100%;
	width: 50%;

	background-color: ${({ theme }) => theme.colors.dark};
	color: ${({ theme }) => theme.colors.textLight50};
`

const StyledSignInInput = styled(SignInInput)`
	color: ${({ theme, disabled }) => (disabled ? theme.colors.textGrey : undefined)};
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : undefined)};
`

const SideImage = styled.img`
	flex: 1;

	height: 100%;
	width: 50%;

	object-fit: cover;

	@media screen and (max-width: 1024px) {
		display: none;
	}
`

const Form = styled.div`
	display: flex;
	flex-direction: column;

	flex: 1 1 0%;

	padding: 40px 80px;
	max-width: 400px;
`

const FormLogo = styled.img`
	width: 32px;
	height: 32px;
	margin-bottom: 16px;
`

const FormTitle = styled.h1`
	color: ${({ theme }) => theme.colors.textLight};
	margin-bottom: 8px;
`

const FormDescription = styled.p`
	margin-bottom: 32px;
`

const SecondaryText = styled.p`
	font-size: 12px;
	text-align: center;
`

const ResendLink = styled.a`
	text-decoration: underline;
	cursor: pointer;
`
