import { useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import styled from 'styled-components'
import { Button } from '../../../components/Button'
import { Column, Row } from '../../../components/Flex'
import { FloatingMessageBox } from '../../../components/FloatingMessageBox'
import { Modals } from '../../../components/Modal'
import { SimpleInput } from '../../../components/SimpleInput'
import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useSendForm } from '../../../hooks/api/useSendForm'
import { useUpdateUser } from '../../../hooks/api/useUpdateUser'
import { useUser } from '../../../hooks/api/useUser'
import { useT } from '../../../hooks/useT'
import { IconWrapper, Selector } from './Selector'

export const OnboardingForm = () => {
	const [t] = useT()
	const trackEvent = useTrackEvent()
	const user = useUser()
	const updateUser = useUpdateUser()
	const sendForm = useSendForm()
	const [errorType, setErrorType] = useState<keyof typeof formValues | null>(null)
	const [formValues, setFormValues] = useState<Record<string, string>>({
		firstname: '',
		lastname: '',
		phoneNumber: '',
		companyName: '',
		companySize: '',
		role: '',
	})

	const [country, setCountry] = useState<{ code: string; name: string }>({ code: 'us', name: 'United States' })

	// hides the form when the component unmounts
	// make it here because we don't have a good way to access the onClose function from the Modal component
	// drawback is that if the user reloads the page, the form is gone :(
	useEffect(() => {
		return () => {
			updateUser.mutateAsync({ formIsFilled: true })
		}
	}, [])

	function getBrowserLocales(options = {}) {
		const defaultOptions = {
			languageCodeOnly: false,
		}
		const opt = {
			...defaultOptions,
			...options,
		}
		const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages
		if (!browserLocales) {
			return undefined
		}
		return browserLocales.map((locale) => {
			const trimmedLocale = locale.trim()
			return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
		})
	}

	function isObjectEmpty(obj: any): boolean {
		for (const key in obj) {
			if (obj.hasOwnProperty(key) && obj[key] === '') {
				return true
			}
		}
		return false
	}

	const onChange = (value: string, name: keyof typeof formValues) => {
		setFormValues((prev) => ({ ...prev, [name]: value }))
	}

	const onSubmit = () => {
		const keys: any = Object.keys(formValues)

		for (let i = 0; i < keys.length; i++) {
			if (!formValues[keys[i]].trim().length) {
				setErrorType(keys[i])
				return
			}
		}

		if (formValues.phoneNumber.length <= 5) {
			setErrorType('phoneNumber')
			return
		}

		if (!isObjectEmpty(formValues)) {
			const payload = {
				...formValues,
				firstname: formValues.firstname.trim(),
				lastname: formValues.lastname.trim(),
				companyName: formValues.companyName.trim(),
				phoneNumber: formValues.phoneNumber.trim(),
				role: formValues.role,
				countryCode: country.code,
				companySize:
					companySizeList.find((obj) => {
						return obj.value === formValues.companySize
					})?.middleValue ?? 1,
			}

			sendForm.mutateAsync(payload)

			// make an api call here
			// you have state that will give you the country name
			// but if you just need the country code you can get it from the onChange function
			Modals.onBoardingForm.close()
			Modals.projectSelector.open()
		}
	}

	const companySizeList = [
		{
			name: '0 - 2',
			value: '0 - 2',
			icon: '🦄',
			middleValue: 1,
		},
		{
			name: '2 - 10',
			value: '2 - 10',
			icon: ' 👫',
			middleValue: 5,
		},
		{
			name: '10 - 100',
			value: '10 - 100',
			icon: '🏋️',
			middleValue: 50,
		},
		{
			name: '100 - 500',
			value: '100 - 500',
			icon: '💪',
			middleValue: 250,
		},
		{
			name: '500 +',
			value: '500 +',
			icon: '∞',
			middleValue: 1000,
		},
	]

	const roles = [
		{
			name: 'Product Management',
			value: 'Product Management',
			icon: '👨‍💼',
		},
		{
			name: 'Engineering',
			value: 'Engineering',
			icon: '👩‍💻',
		},
		{
			name: 'Support',
			value: 'Support',
			icon: '☎️',
		},
		{
			name: 'Administration',
			value: 'Administration',
			icon: '🎯',
		},
		{
			name: 'Other',
			value: 'Other',
			icon: '🤔',
		},
	]

	return (
		<Container>
			<Column>
				<Title>{t('Welcome to Notice !', 'welcomeToNotice')}</Title>
				<Subtitle>
					{t(
						'Please help us with the process of providing you the complete Notice experience.',
						'pleaseHelpUsWithForm'
					)}
				</Subtitle>
			</Column>
			<FormContainer gap={26}>
				<Row gap={24}>
					<FloatingMessageBox
						content={t('Please enter your first name', 'pleaseEnterYourFirstName')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'firstname'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('First name', 'firstname')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<StyledInput
								onFocus={() => errorType === 'firstname' && setErrorType(null)}
								onChange={(value) => onChange(value, 'firstname')}
								value={formValues.firstname}
								placeholder={t('First Name', 'firstname')}
								autoComplete="given-name"
								isError={errorType === 'firstname'}
							/>
						</StyledColumn>
					</FloatingMessageBox>
					<FloatingMessageBox
						content={t('Please enter your last name', 'pleaseEnterYourLastName')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'lastname'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('Last name', 'lastname')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<StyledInput
								onFocus={() => errorType === 'lastname' && setErrorType(null)}
								onChange={(value) => onChange(value, 'lastname')}
								value={formValues.lastname}
								placeholder={t('Last Name', 'lastname')}
								isError={errorType === 'lastname'}
								autoComplete="family-name"
							/>
						</StyledColumn>
					</FloatingMessageBox>
				</Row>
				<Row gap={18}>
					<FloatingMessageBox
						content={t('Please enter a valid phone number', 'pleasEnterAValidPhoneNumber')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'phoneNumber'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('Phone Number', 'phoneNumber')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<PhoneInputWrapper>
								<PhoneInput
									defaultCountry={getBrowserLocales()?.[1] ?? 'us'}
									placeholder={t('Phone number', 'phoneNumber')}
									value={formValues.phoneNumber}
									onChange={(value, { country }) => {
										onChange(value, 'phoneNumber')
										setCountry({ name: country.name, code: country.iso2 })
									}}
									disableDialCodeAndPrefix={true}
									showDisabledDialCodeAndPrefix={true}
									disableDialCodePrefill={true}
									disableFormatting={true}
									// don't force the user to enter the proper length for the phone.
									// because auto complete will fill the rest of the phone number with or without the code
									// disableFormatting={true}
									onFocus={() => errorType === 'phoneNumber' && setErrorType(null)}
									required
								/>
							</PhoneInputWrapper>
						</StyledColumn>
					</FloatingMessageBox>
					<FloatingMessageBox
						content={t('Please enter your company name', 'pleaseEnterYourCompanyName')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'companyName'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('Company name', 'companyName')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<StyledInput
								onFocus={() => errorType === 'companyName' && setErrorType(null)}
								onChange={(value) => onChange(value, 'companyName')}
								value={formValues.companyName}
								placeholder={t('Company name', 'companyName')}
								isError={errorType === 'companyName'}
								autoComplete="organization"
							/>
						</StyledColumn>
					</FloatingMessageBox>
				</Row>
				<Row gap={18}>
					<FloatingMessageBox
						content={t('Please choose your company size', 'pleaseChooseYourCompanySize')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'companySize'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('Company Size', 'companySize')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<Selector
								defaultValue={formValues.companySize}
								values={companySizeList.map((obj) => {
									return {
										name: obj.name,
										value: obj.value,
										icon: obj.icon,
									}
								})}
								onUpdate={(value) => onChange(value, 'companySize')}
								onClick={() => errorType === 'companySize' && setErrorType(null)}
								currentValue={formValues.companySize}
								displayName={(value) => value}
								displayIcon={(value) => {
									const object = companySizeList.find((obj) => {
										return obj.name === value
									})
									return <IconWrapper>{object?.icon}</IconWrapper>
								}}
							/>
						</StyledColumn>
					</FloatingMessageBox>
					<FloatingMessageBox
						content={t('Please choose your role in the company', 'pleaseChooseYourRoleInTheCompany')}
						placement="top"
						offset={[0, 2]}
						show={errorType === 'role'}
					>
						<StyledColumn gap={4}>
							<FormLabel>
								{t('Company Role', 'companyRole')} <RequiredIndicator> * </RequiredIndicator>
							</FormLabel>
							<Selector
								defaultValue={formValues.role}
								values={roles}
								onClick={() => errorType === 'role' && setErrorType(null)}
								onUpdate={(value) => onChange(value, 'role')}
								currentValue={formValues.role}
								displayName={(value) => value}
								displayIcon={(value) => {
									const object = roles.find((obj) => {
										return obj.name === value
									})
									return <IconWrapper>{object?.icon}</IconWrapper>
								}}
							/>
						</StyledColumn>
					</FloatingMessageBox>
				</Row>
			</FormContainer>
			<Footer>
				<StyledButton onClick={onSubmit}>{t('Start creating !', 'startCreating')}</StyledButton>
			</Footer>
		</Container>
	)
}

const Container = styled.div`
	width: 550px;
	user-select: none;
	padding: 24px 24px 12px 24px;
`

const Title = styled.h1`
	font-weight: 700;
	font-size: 26px;
	color: ${({ theme }) => theme.colors.primaryDark};
`

const Subtitle = styled.div`
	font-weight: 400;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const FormContainer = styled(Column)`
	position: relative;
	box-sizing: border-box;
	margin: 34px 0;
	width: 100%;
`
const FormLabel = styled.div`
	font-size: 12px;
	font-style: normal;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.greyDark};
`

const RequiredIndicator = styled.span`
	font-size: 13px;
	font-style: bold;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.error};
`

const StyledColumn = styled(Column)`
	position: relative;
	width: 50%;
	box-sizing: border-box;
`

const StyledInput = styled(SimpleInput)`
	&:-webkit-autofill,
	&:-webkit-autofill:hover,
	&:-webkit-autofill:focus,
	&:-webkit-autofill:active {
		-webkit-background-clip: text;
		-webkit-text-fill-color: ${({ theme }) => theme.colors.textDark};
		transition: background-color 5000s ease-in-out 0s;
		box-shadow: inset 0 0 20px 20px #ffff;
	}
`

const PhoneInputWrapper = styled.div`
	width: 100%;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.border};

	&:focus-within {
		border: 1px solid ${({ theme }) => theme.colors.primary};
	}

	.react-international-phone-dial-code-preview {
		padding: 0px;
		padding-left: 4px;
		border: 1px solid transparent;
	}

	.react-international-phone-country-selector-button {
		padding: 19px 4px;
		border: none;
		border-top-left-radius: ${({ theme }) => theme.borderRadius};
		border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
	}

	.react-international-phone-input {
		padding: 19px 6px;
		width: 100%;

		border: none;
		border-top-right-radius: ${({ theme }) => theme.borderRadius};
		border-bottom-right-radius: ${({ theme }) => theme.borderRadius};

		color: ${({ theme }) => theme.colors.textDark};
		font-weight: 500;
		font-size: 14px;

		&::placeholder {
			color: ${({ theme }) => theme.colors.grey};
			padding-left: 2px;
		}

		&:-webkit-autofill,
		&:-webkit-autofill:hover,
		&:-webkit-autofill:focus,
		&:-webkit-autofill:active {
			-webkit-background-clip: text;
			-webkit-text-fill-color: ${({ theme }) => theme.colors.textDark};
			transition: background-color 5000s ease-in-out 0s;
			box-shadow: inset 0 0 20px 20px #ffff;
		}
	}

	.react-international-phone-country-selector-dropdown {
		height: 150px;
	}
`

const Footer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	margin-top: 36px;
	margin-bottom: 16px;
`

const StyledButton = styled(Button)`
	letter-spacing: 1px;
	width: 90%;
`
