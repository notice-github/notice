import axios from 'axios'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { NUrls } from '@notice-app/utils'
import { toast } from 'react-toastify'
import { Button } from '../components/Button'
import { Show } from '../components/Show'
import { SignInInput } from '../components/SignInInput'
import { useSearchParam } from '../hooks/useSearchParam'
import { GithubIcon, GoogleIcon } from '../icons'
import { Pages } from '../pages'
import { queryClient } from '../utils/query'
import { GTM } from '../utils/GTM'
import { useT } from '../hooks/useT'
import { AIAssistant } from './Editor/src/Editor/AIAssistant'

interface Props {
	title: string
	description: string
	switchLink: string
	switchText: string
	rescueLink?: boolean
}

export const SignPageContainer = ({ title, description, switchLink, switchText, rescueLink = false }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()
	const [next] = useSearchParam('next')

	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [useEmail, setUseEmail] = useState(false)
	const [inProgress, setInProgress] = useState(false)

	const signInWithCode = async () => {
		try {
			const res = await axios.post(
				`${NUrls.App.api()}/auth/email`,
				{
					email: email.trim(),
					code: code.trim(),
				},
				{
					withCredentials: true,
					params: {
						source: window.location.href,
						next: next ?? undefined,
					},
				}
			)

			if (res.data.success) {
				await queryClient.refetchQueries()
				if (next != null) {
					try {
						navigate(next, { state: { clear: true } })
					} catch (ex) {
						navigate(Pages.ROOT)
					}
				} else {
					navigate(Pages.ROOT)
				}
			}
		} catch (ex) {
			toast.error('Wrong temporary code')
		}
	}

	const continueWith = (provider: 'email' | 'google' | 'github') => {
		return async () => {
			GTM.send({ event: 'login', method: provider })

			if (provider === 'email') {
				if (email.trim() === '') return

				setInProgress(true)

				if (useEmail) {
					signInWithCode()
					setInProgress(false)
					return
				}

				try {
					await axios.post(`${NUrls.App.api()}/auth/email`, {
						email: email.trim(),
					})
				} catch (e: any) {
					if (e?.response?.data?.error?.type === 'invalid') toast.error('Invalid email address')
					setInProgress(false)

					return
				}

				setUseEmail(true)
				setInProgress(false)
			} else {
				const url =
					`${NUrls.App.api()}/auth/${provider}` +
					`?source=${encodeURIComponent(window.location.href)}` +
					`${next != null ? `&next=${encodeURIComponent(next)}` : ''}`

				try {
					const nextSearch = new URLSearchParams((next?.toString() ?? '').replace('/editor', ''))

					if (nextSearch.get('_iframe') === 'wordpress') {
						const popup = window.open(url, '_blank')

						if (popup != null) {
							const startTime = Date.now()
							const interval = setInterval(() => {
								if (Date.now() - startTime > 60_000) {
									clearInterval(interval)
									return
								}

								if (popup.closed) {
									clearInterval(interval)
									window.location.pathname = '/editor'
								}
							}, 500)
						}
					} else {
						window.location.href = url
					}
				} catch (_) {
					window.location.href = url
				}
			}
		}
	}

	return (
		<Container>
			<FormWrapper>
				<Form>
					<FormLogo src="https://assets.notice.studio/branding/logo.png" />
					<FormTitle>{title}</FormTitle>
					<FormDescription>{description}</FormDescription>
					<ButtonsWrapper>
						<Button color={theme.colors.secondary} onClick={continueWith('google')} outlined dark>
							<GoogleIcon size={18} />
							{t('Continue with Google', 'continueWithGoogle')}
						</Button>
						<Button color={theme.colors.secondary} onClick={continueWith('github')} outlined dark>
							<GithubIcon size={18} />
							{t('Continue with Github', 'continueWithGithub')}
						</Button>
					</ButtonsWrapper>
					<Separator />
					<SecondaryText style={{ marginTop: '24px', marginBottom: '16px' }}>
						{t('Or sign in using a work email', 'orSignInUsingWorkEmail')}
					</SecondaryText>
					<SignInInput
						type="email"
						placeholder={t('Enter work email', 'enterWorkEmail')}
						value={email}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								continueWith('email')()
							}
						}}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Show when={useEmail}>
						<SecondaryText style={{ marginTop: '16px', marginBottom: '24px' }}>
							{t('We just sent you a temporary login code.', 'weJustSentYouATemporaryLoginCode')}
							<br />
							{t('Please check your inbox.', 'pleaseCheckYourInbox')}
						</SecondaryText>
						<SignInInput
							type="text"
							placeholder={t('Enter temporary code', 'enterTemporaryCode')}
							value={code}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									continueWith('email')()
								}
							}}
							onChange={(e) => setCode(e.target.value)}
							autoFocus
						/>
					</Show>
					<Button style={{ marginTop: '16px' }} onClick={continueWith('email')} loader={inProgress}>
						{useEmail
							? t('Continue with Login code', 'continueWithLoginCode')
							: t('Continue with Email', 'continueWithEmail')}
					</Button>
					<Show when={rescueLink}>
						<RescueLink to={Pages.SIGNIN}>
							{t('Already have an account? Sign In', 'alreadyHaveAnAccountSignIn')}
						</RescueLink>
					</Show>
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

const SideImage = styled.img`
	flex: 1;

	height: 100%;
	width: 50%;

	object-fit: cover;

	@media screen and (max-width: 1024px) {
		display: none;
	}
`

const SwitchLink = styled(NavLink)`
	position: absolute;
	top: 0;
	right: 0;

	padding: 24px;

	text-decoration: none;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLight50};

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
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

const FormDescription = styled.p``

const ButtonsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 24px 0;
`

const Separator = styled.div`
	width: 100%;
	height: 1px;
	margin-top: 8px;
	background-color: ${({ theme }) => theme.colors.secondary};
`

const SecondaryText = styled.p`
	font-size: 12px;
	text-align: center;
`

const RescueLink = styled(NavLink)`
	margin-top: 32px;
	color: ${({ theme }) => theme.colors.textLight50};
`
