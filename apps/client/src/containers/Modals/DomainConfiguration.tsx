import { NSystem } from '@notice-app/utils'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import InlineCode from '../../components/InlineCode'
import { Loader } from '../../components/Loader'
import { SettingDropdown } from '../../components/Settings/SetingDropdown'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SimpleInput } from '../../components/SimpleInput'
import { Stepper } from '../../components/Stepper'
import { useDomainApply } from '../../hooks/bms/domain/useDomainApply'
import { useDomainCheckAvailability } from '../../hooks/bms/domain/useDomainCheckAvailability'
import { useDomainCheckDNS } from '../../hooks/bms/domain/useDomainCheckDNS'
import { useDomainSetup } from '../../hooks/bms/domain/useDomainSetup'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import useCopyToClipboard from '../../hooks/useCopyToClipboard'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { CopyIcon } from '../../icons/CopyIcon'
import { InfoIcon } from '../../icons/InfoIcon'
import Tick from '../../icons/Tick'
import { Consts } from '../../utils/consts'
import { useT } from '../../hooks/useT'

interface Props {}

export const DomainConfiguration = ({}: Props) => {
	const theme = useTheme()

	const [step, setStep] = useState(1)
	const [domain, setDomain] = useState('')

	return (
		<>
			{step > 1 && (
				<BackButton onClick={() => setStep(step - 1)}>
					<ArrowIcon size={20} color={theme.colors.greyDark} />
				</BackButton>
			)}
			<Container>
				<Stepper
					steps={[
						{ label: 'Domain', step: 1 },
						{ label: 'Configuration', step: 2 },
						{ label: 'Validation', step: 3 },
					]}
					activeStep={step}
				/>
				<ActiveStepContainer>
					{step === 1 && (
						<DomainStep
							domain={domain}
							onFinish={(value) => {
								setDomain(value)
								setStep(2)
							}}
						/>
					)}
					{step === 2 && <ConfigurationStep domain={domain} onFinish={() => setStep(3)} />}
					{step === 3 && (
						<SetupStep
							domain={domain}
							onFinish={() => {
								window.location.reload()
							}}
						/>
					)}
				</ActiveStepContainer>
			</Container>
		</>
	)
}

const Container = styled.div`
	min-width: 350px;
	padding: 32px 92px;
`

const BackButton = styled.div`
	position: absolute;
	top: 12px;
	left: 12px;

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 12px;

	cursor: pointer;
`

const ActiveStepContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;

	margin-top: 64px;
`

const DomainStep = ({ domain, onFinish }: { domain: string; onFinish: (domain: string) => any }) => {
	const [t] = useT()
	const theme = useTheme()

	const checker = useDomainCheckAvailability()

	const [value, setValue] = useState(domain)
	const [error, setError] = useState<string>()

	const isValid = useMemo(() => {
		if (typeof value !== 'string') return false
		if (!Consts.DOMAIN_REGEX.test(value)) return false
		return true
	}, [value])

	const onConfigure = async () => {
		if (!isValid || checker.isLoading) return
		setError(undefined)

		const { check, reason } = await checker.mutateAsync({ domain: value })
		if (check === 'KO') {
			setError(reason)
			return
		}

		onFinish(value)
	}

	return (
		<>
			<Title>{t('What domain would you like to link to your project?', 'whatDomainWouldYouLikeToLink')}</Title>
			<div>
				<SimpleInput
					type="text"
					style={{ width: 350 }}
					value={value}
					onChange={setValue}
					onEnter={onConfigure}
					// validator={() => value === '' || isValid}
					placeholder="Enter your domain e.g blog.notice.studio"
				/>
				{/* {!(value === '' || isValid) && <Hint>{t('This hostname is invalid. Only subdomains are allowed', 'hostnameIsInvalid')}</Hint>} */}
			</div>
			<InfoWrapper>
				<InfoIcon size={14} color={theme.colors.primary} />
				<Info>
					{t('You must own the domain and have the ability to edit DNS records', 'mustOwnSubdomainAndAbilityToEditDNS')}
				</Info>
			</InfoWrapper>
			<SettingButton disabled={!isValid} onClick={onConfigure} loader={checker.isLoading} primary>
				{t('Configure DNS', 'configureDNS')}
			</SettingButton>
			{error && (
				<ErrorContainer>
					<ErrorMessage>
						Domain <InlineCode>{value}</InlineCode> is already used by another project. If you want to do it anyway, you
						must unlink this custom domain from the project first.
						<br />
						[code: {error}]
					</ErrorMessage>
				</ErrorContainer>
			)}
		</>
	)
}

const Title = styled.h1`
	max-width: 500px;
	text-align: center;
	margin-bottom: 16px;
`

const Description = styled.p`
	margin-top: -16px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const InfoWrapper = styled.div`
	display: flex;
	gap: 6px;
	align-items: center;
	margin-bottom: 16px;
`

const Info = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const InfoLink = styled.a`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.primary};
`

const Hint = styled.p`
	margin: 4px 0 0 2px;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.error};
`

const ConfigurationStep = ({ domain, onFinish }: { domain: string; onFinish: () => any }) => {
	const theme = useTheme()

	const checker = useDomainCheckDNS()
	const [isNameCopied, copyName] = useCopyToClipboard()
	const [isValueCopied, copyValue] = useCopyToClipboard()
	const [isValue2Copied, copyValue2] = useCopyToClipboard()

	const [error, setError] = useState<string>()

	const isCNAME = useMemo(
		() => domain.replace(Consts.SLD_REGEX, (sub) => sub.replace('.', '')).split('.').length > 2,
		[domain]
	)

	const name = useMemo(() => {
		return domain
			.replace(Consts.SLD_REGEX, (sub) => sub.replace('.', ''))
			.split('.')
			.slice(0, -2)
			.join('.')
	}, [domain])

	const onCheck = async () => {
		if (checker.isLoading) return
		setError(undefined)

		const { check, reason } = await checker.mutateAsync({ domain })
		if (check === 'KO') {
			setError(reason)
			return
		}

		onFinish()
	}

	return (
		<>
			<Title>Configure your DNS</Title>
			<Description>
				{isCNAME
					? 'Add a CNAME record to your domain in your DNS provider website'
					: 'Add both A records to your domain in your DNS provider website'}
			</Description>
			{isCNAME ? (
				<DNSTable>
					<DNSColumn>
						<DNSName>Type</DNSName>
						<DNSValue>
							<SettingDropdown
								values={['CNAME']}
								currentValue="CNAME"
								displayName={(name) => name}
								style={{ height: 40 }}
								disabled
							/>
						</DNSValue>
					</DNSColumn>
					<DNSColumn>
						<DNSName>Name</DNSName>
						<DNSValue>
							<SimpleInput
								value={name}
								suffix={
									<CopyButton onClick={() => copyName(name)}>
										{isNameCopied ? (
											<Tick size={16} color={theme.colors.primary} />
										) : (
											<CopyIcon size={16} color={theme.colors.primary} />
										)}
									</CopyButton>
								}
								noSuffixBorder
								disabled
							/>
						</DNSValue>
					</DNSColumn>
					<DNSColumn>
						<DNSName>Value</DNSName>
						<DNSValue>
							<SimpleInput
								value="notice.site"
								suffix={
									<CopyButton onClick={() => copyValue('notice.site')}>
										{isValueCopied ? (
											<Tick size={16} color={theme.colors.primary} />
										) : (
											<CopyIcon size={16} color={theme.colors.primary} />
										)}
									</CopyButton>
								}
								noSuffixBorder
								disabled
							/>
						</DNSValue>
					</DNSColumn>
				</DNSTable>
			) : (
				<DNSTable>
					<DNSColumn>
						<DNSName>Type</DNSName>
						<DNSValue style={{ marginBottom: '8px' }}>
							<SettingDropdown
								values={['A']}
								currentValue="A"
								displayName={(name) => name}
								style={{ height: 40 }}
								disabled
							/>
						</DNSValue>
						{/* <DNSValue>
							<SettingDropdown
								values={['A']}
								currentValue="A"
								displayName={(name) => name}
								style={{ height: 40 }}
								disabled
							/>
						</DNSValue> */}
					</DNSColumn>
					<DNSColumn>
						<DNSName>Name</DNSName>
						<DNSValue style={{ marginBottom: '8px', width: '150px' }}>
							<SimpleInput value={'@'} disabled />
						</DNSValue>
						{/* <DNSValue style={{ width: '150px' }}>
							<SimpleInput value={'@'} disabled />
						</DNSValue> */}
					</DNSColumn>
					<DNSColumn>
						<DNSName>Value</DNSName>
						<DNSValue style={{ marginBottom: '8px' }}>
							<SimpleInput
								value="13.248.172.137"
								suffix={
									<CopyButton onClick={() => copyValue('13.248.172.137')}>
										{isValueCopied ? (
											<Tick size={16} color={theme.colors.primary} />
										) : (
											<CopyIcon size={16} color={theme.colors.primary} />
										)}
									</CopyButton>
								}
								noSuffixBorder
								disabled
							/>
						</DNSValue>
						<DNSValue>
							<SimpleInput
								value="76.223.62.181"
								suffix={
									<CopyButton onClick={() => copyValue2('76.223.62.181')}>
										{isValue2Copied ? (
											<Tick size={16} color={theme.colors.primary} />
										) : (
											<CopyIcon size={16} color={theme.colors.primary} />
										)}
									</CopyButton>
								}
								noSuffixBorder
								disabled
							/>
						</DNSValue>
					</DNSColumn>
				</DNSTable>
			)}
			<SettingButton loader={checker.isLoading} onClick={onCheck} primary>
				Check my configuration
			</SettingButton>
			<InfoWrapper>
				<InfoIcon size={14} color={theme.colors.primary} />
				<InfoLink href="https://documentation.notice.studio/custom-domain-gncv249whp" target="_blank">
					Read our configuration guide
				</InfoLink>
			</InfoWrapper>
			{error && (
				<ErrorContainer>
					<ErrorMessage>
						The provided domain is missing a {isCNAME ? 'CNAME' : 'A'} record pointing to{' '}
						{isCNAME ? (
							<InlineCode>notice.site</InlineCode>
						) : (
							<>
								<InlineCode>13.248.172.137</InlineCode>/<InlineCode>76.223.62.181</InlineCode>
							</>
						)}
						or the update has not yet propagated
						<br />
						[code: {error}]
					</ErrorMessage>
				</ErrorContainer>
			)}
		</>
	)
}

const DNSTable = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 12px;

	padding: 12px;
	margin: 16px 0;

	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.lightGrey};
`

const DNSColumn = styled.div`
	display: flex;
	flex-direction: column;
`

const DNSName = styled.span`
	font-weight: 700;
	margin-bottom: 4px;
	margin-left: 2px;
`

const DNSValue = styled.div`
	max-width: 250px;
	background-color: ${({ theme }) => theme.colors.white};
	border-radius: ${({ theme }) => theme.borderRadius};
`

const ErrorContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;

	padding: 8px;

	max-width: 600px;
	text-align: center;

	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.lightGrey};
`

const ErrorMessage = styled.p`
	color: ${({ theme }) => theme.colors.error};
`

const CopyButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 16px;
	height: 100%;

	cursor: pointer;
`

const SetupStep = ({ domain, onFinish }: { domain: string; onFinish: () => any }) => {
	const theme = useTheme()
	const [project] = useCurrentProject()

	const isRunningRef = useRef(false)

	const [isSetup, setSetup] = useState<boolean>(false)
	const [isSSL, setSSL] = useState<boolean>(false)
	const [isApply, setApply] = useState<boolean>(false)
	const [step, setStep] = useState<'setup' | 'ssl' | 'apply' | 'done'>()

	const [error, setError] = useState<string>()

	const isCNAME = useMemo(
		() => domain.replace(Consts.SLD_REGEX, (sub) => sub.replace('.', '')).split('.').length > 2,
		[domain]
	)

	const setup = useDomainSetup()
	const apply = useDomainApply()

	const process = async () => {
		if (!project || isRunningRef.current === true) return
		isRunningRef.current = true

		setSetup(false)
		setSSL(false)
		setApply(false)
		setError(undefined)

		try {
			setStep('setup')
			const setupPromise = setup.mutateAsync({ block: project, domain })
			await NSystem.sleep(500)
			setSetup(true)

			setStep('ssl')
			await setupPromise
			// await NSystem.sleep(10_000)
			setSSL(true)

			setStep('apply')
			await apply.mutateAsync({ block: project, domain })
			await NSystem.sleep(1000)
			setApply(true)

			setStep('done')
		} catch (ex: any) {
			const error = ex.response?.data?.error
			if (error) setError(error.type)
		}

		isRunningRef.current = false
	}

	useLayoutEffect(() => {
		process()
	}, [])

	return (
		<>
			<Title>Setting up your custom domain</Title>
			<StepContainer>
				<Step finished={isSetup} error={!!error && step === 'setup'}>
					{step !== 'setup' && <InfoIcon size={16} color={isSetup ? theme.colors.primary : theme.colors.grey} />}
					{step === 'setup' && !error && <Loader color={theme.colors.grey} size={16} />}
					{step === 'setup' && !!error && <InfoIcon size={16} color={theme.colors.error} />}
					Setup for {domain}
				</Step>
				<Step finished={isSSL} error={!!error && step === 'ssl'}>
					{step === 'ssl' && <Loader color={theme.colors.grey} size={16} />}
					{step !== 'ssl' && <InfoIcon size={16} color={isSSL ? theme.colors.primary : theme.colors.grey} />}
					Generate SSL Certificate
				</Step>
				<Step finished={isApply} error={!!error && step === 'apply'}>
					{step !== 'apply' && <InfoIcon size={16} color={isApply ? theme.colors.primary : theme.colors.grey} />}
					{step === 'apply' && !error && <Loader color={theme.colors.grey} size={16} />}
					{step === 'apply' && !!error && <InfoIcon size={16} color={theme.colors.error} />}
					Link custom domain to the project
				</Step>
			</StepContainer>
			{error && (
				<ErrorContainer>
					<ErrorMessage>
						{error === 'already_used' && (
							<>
								Domain <InlineCode>{domain}</InlineCode> is already used by another project. If you are the owner of the
								project, you can unlink it and retry on this one.
							</>
						)}
						{error === 'invalid_domain' && (
							<>
								The provided domain is missing a {isCNAME ? 'CNAME' : 'A'} record pointing to{' '}
								{isCNAME ? (
									<InlineCode>notice.site</InlineCode>
								) : (
									<>
										<InlineCode>13.248.172.137</InlineCode>/<InlineCode>76.223.62.181</InlineCode>
									</>
								)}{' '}
								or the update has not yet propagated
							</>
						)}
						{error === 'not_owner' && (
							<>
								You are trying to use a domain that is already linked to an existing online website. If you are the
								owner of this domain and you want to link it to your project, please contact us.
							</>
						)}
						<br />
						[code: {error}]
					</ErrorMessage>
				</ErrorContainer>
			)}
			<SettingButton disabled={step !== 'done'} onClick={onFinish} primary>
				Finish Setup
			</SettingButton>
		</>
	)
}

const StepContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 16px;
`

const Step = styled.div<{ finished: boolean; error: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16px;

	color: ${({ theme, finished, error }) =>
		finished ? theme.colors.primary : error ? theme.colors.error : theme.colors.textLightGrey};
`
