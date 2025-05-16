import { useMemo } from 'react'
import styled from 'styled-components'
import { Stepper } from '../../components/Stepper'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useUser } from '../../hooks/api/useUser'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useT } from '../../hooks/useT'
import { OnboardingForm } from './form'
import { ChooseYourIntegration } from './integration'
import { ProjectSelector } from './project'

export const OnboardingPage = () => {
	const user = useUser()
	const [t] = useT()
	const [strStep, setStep] = useSearchParam('step')
	const step = useMemo(() => parseInt(strStep ?? (user.formIsFilled ? '3' : '1')), [strStep])
	const trackEvent = useTrackEvent()

	return (
		<Container>
			<Stepper
				style={{ width: 'calc(100% - 60px*2)', marginLeft: '60px', marginRight: '60px', marginBottom: '50px' }}
				steps={[
					{ label: t('Welcome to Notice !', 'welcomeToNotice'), step: 1 },
					{ label: t('Select Your Project', 'selectYourProject'), step: 2 },
					{ label: t('Choose your integration', 'chooseYourIntegration'), step: 3 },
				]}
				activeStep={step}
			/>
			{step === 1 && <OnboardingForm onFinish={() => setStep('2')} />}
			{step === 2 && <ProjectSelector onFinish={() => setStep('3')} />}
			{step === 3 && (
				<ChooseYourIntegration
					onFinish={(type: string) => {
						setStep(null)
					}}
				/>
			)}
		</Container>
	)
}

const Container = styled.div`
	height: 615px;
	padding: 32px 16px 0 16px;
	display: flex;
	overflow-y: hidden;
	flex-direction: column;
`
