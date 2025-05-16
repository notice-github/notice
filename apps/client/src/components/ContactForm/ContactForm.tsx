import { darken, lighten } from 'polished'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import styled, { useTheme } from 'styled-components'
import { IContactForm } from '../../containers/Modals/ContactUs'
import { useSendContactMessage } from '../../hooks/api/useSendContactMessage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { QuestionMark } from '../../icons/QuestionMark'
import { Row } from '../Flex'
import { Loader } from '../Loader'
import { Modals } from '../Modal'
import { Show } from '../Show'
import { SimpleInput } from '../SimpleInput'
import { useUser } from '../../hooks/api/useUser'

interface IProps {
	setExpanded: Dispatch<SetStateAction<boolean>>
}

const ContactForm = ({ setExpanded }: IProps) => {
	const user = useUser()
	const defaultEmail = user?.email ?? ''

	const [contactForm, setContactForm] = useState<IContactForm>({
		email: defaultEmail,
		subject: '',
		message: '',
	})
	const theme = useTheme()
	const [project] = useCurrentProject()
	const { id, data } = project || {}
	const [error, setError] = useState<string | null>(null)

	const contactMutation = useSendContactMessage()

	const handleValueChange = (value: Record<string, string>) => {
		setContactForm((oldValue) => ({ ...oldValue, ...value }))
		if (error !== null) {
			setError(null)
		}
	}

	const sendContactMessage = () => {
		const { email, subject, message } = contactForm
		if (email === '') return setError('Email is required')
		if (!/.+@.+/.test(email)) return setError('Invalid email address')
		if (subject === '') return setError('Please enter a subject')
		if (subject.length > 128) return setError('Your Subject is too long')
		if (message === '') return setError('Please enter a message')

		contactMutation.mutateAsync(
			{
				contactData: {
					projectTitle: data?.text,
					projectId: id ?? '',
					content: contactForm.message,
					senderEmail: contactForm.email,
					emailSubject: contactForm.subject,
					contactingNotice: true,
				},
			},
			{
				onSuccess: () => {
					setContactForm({
						email: '',
						subject: '',
						message: '',
					})
					setExpanded(false)
					setTimeout(() => {
						Modals.contactUs.close()
					}, 650)
					toast.success('🚀 Your message successfully sent !', {
						closeOnClick: true,
						autoClose: 5000,
						position: 'top-right',
						toastId: 'toastAvoidsDuplicates',
					})
				},

				onError: () => setError('Something went wrong !'),
			}
		)
	}

	return (
		<FlexColumn>
			<InputWrapper>
				<StyledLabel>Email</StyledLabel>
				<StyledSimpleInput
					type="email"
					value={contactForm.email}
					onChange={(value) => handleValueChange({ email: value })}
					style={{ width: '100%', boxSizing: 'border-box' }}
				/>
			</InputWrapper>
			<InputWrapper>
				<StyledLabel>Subject</StyledLabel>
				<StyledSimpleInput
					value={contactForm.subject}
					onChange={(value) => handleValueChange({ subject: value })}
					style={{ width: '100%', boxSizing: 'border-box' }}
				/>
			</InputWrapper>
			<InputWrapper>
				<StyledLabel>Message</StyledLabel>
				<StyledTextArea value={contactForm.message} onChange={(e) => handleValueChange({ message: e.target.value })} />
			</InputWrapper>
			<Row style={{ width: '100%' }} align="center" justify="space-between">
				<Show when={contactMutation.isLoading}>
					<Loader />
				</Show>
				<Show when={contactMutation.isError || error !== null}>
					<Row gap={4} justify="center" align="center" style={{ flexWrap: 'wrap' }}>
						<QuestionMark color={theme.colors.textRed} />
						<ErrorMessage>{error}</ErrorMessage>
					</Row>
				</Show>
				<SendButton onClick={sendContactMessage}>Send Message</SendButton>
			</Row>
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	padding: 26px;

	align-items: center;
	width: 400px;
	height: auto;
	gap: 20px;
	box-sizing: border-box;
`

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;

	width: 100%;
	gap: 4px;
`

const StyledSimpleInput = styled(SimpleInput)`
	width: 100%;
`

const StyledLabel = styled.div`
	font-size: 14px;
	font-weight: 400;
`

const SendButton = styled.div`
	overflow: hidden;
	padding: 10px;
	border-radius: 6px;
	width: 110px;

	cursor: pointer;
	margin-left: auto;
	margin-top: auto;
	border: 1px solid ${({ theme }) => theme.colors.lightGrey};
	background-color: ${({ theme }) => lighten(0.03, theme.colors.dark)};

	color: ${({ theme }) => theme.colors.white};

	&:hover {
		background-color: ${({ theme }) => darken(0.03, theme.colors.dark)};
	}
`

const ErrorMessage = styled.div`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textRed};
`

const StyledTextArea = styled.textarea`
	height: 116px;
	width: 100%;
	${({ theme }) => theme.fonts.regular};
	color: ${({ theme }) => theme.colors.textDark};

	&::placeholder {
		color: ${({ theme }) => theme.colors.grey};
		padding-left: 2px;
	}

	/* Reset */
	outline-style: none;
	overflow: hidden;
	appearance: none;
	background-color: transparent;
	line-height: 22px;
	box-sizing: border-box;
	resize: none;

	padding: 8px 16px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};

	&:focus-within {
		border-color: ${({ theme }) => theme.colors.primary};
	}
`

export default ContactForm
