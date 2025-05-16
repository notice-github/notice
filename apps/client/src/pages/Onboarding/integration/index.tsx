import { NUrls } from '@notice-app/utils'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { Button } from '../../../components/Button'
import { Spacer } from '../../../components/Flex'
import { Loader } from '../../../components/Loader'
import { INTEGRATIONS } from '../../../data/integrations'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { usePublish } from '../../../hooks/bms/usePublish'
import { invalidatePublishState, usePublishState } from '../../../hooks/bms/usePublishState'
import { useT } from '../../../hooks/useT'
import { CheckCircle } from '../../../icons'
import { ArrowRight } from '../../../icons/ArrowRight'
import { OpenIcon } from '../../../icons/OpenIcon'
import { Pages } from '../../../pages'
import { IntegrationCard } from './IntegrationCard'

interface Props {
	onFinish: (type: string) => any
}

export const ChooseYourIntegration = ({ onFinish }: Props) => {
	const theme = useTheme()
	const [t] = useT()
	const [project] = useCurrentProject()
	const navigate = useNavigate()
	const publish = usePublish()
	const publishState = usePublishState()

	useEffect(() => {
		if (project) {
			const timeout = setTimeout(() => {
				publish.mutateAsync({ block: project }).then(() => invalidatePublishState(project.id))
			}, 250)
			return () => clearTimeout(timeout)
		}
	}, [project])

	const onOpenLink = () => {
		if (!project) return
		window.open(
			NUrls.App.wildcardURL(project.preferences?.domain || project.id, project.preferences?.customDomain),
			'_blank'
		)
		onFinish('link')
		navigate(Pages.EDITOR)
	}

	const onOpenIntegration = (integration: string) => {
		onFinish(integration)
		navigate(Pages.INTEGRATION_VIEW(integration))
	}

	const onSkip = () => {
		onFinish('skip')
		navigate(Pages.EDITOR)
	}

	if (publishState.data !== 'up_to_date') {
		return (
			<LoadingContainer>
				<Loader />
				<p>{t('Publishing your project', 'publishingYourProject')}</p>
			</LoadingContainer>
		)
	}

	return (
		<Container>
			<IconWrapper>
				<CheckCircle size={28} color={theme.colors.primary} />
				<Title>{t('Choose your integration', 'chooseYourIntegration')}</Title>
			</IconWrapper>
			<Subtitle>
				{t(
					'Your Notice project has been created! Add this new project to your website using one of our integrations or directly via the pre-generated link for you.',
					'projectCreated'
				)}
			</Subtitle>
			<IntegrationCard integration={INTEGRATIONS[1]} onClick={() => onOpenIntegration(INTEGRATIONS[1].id)} />
			<IntegrationGrid>
				<IntegrationCard
					integration={INTEGRATIONS[7]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[7].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[8]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[8].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[9]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[9].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[10]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[10].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[2]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[2].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[0]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[0].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[12]}
					overrideName="HTML5"
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[12].id)}
				/>
				<IntegrationCard
					integration={INTEGRATIONS[14]}
					secondary
					onClick={() => onOpenIntegration(INTEGRATIONS[14].id)}
				/>
			</IntegrationGrid>
			<Footer>
				<DomainContainer onClick={onOpenLink}>
					<DomainIcon src={'/assets/svg/link.svg'} />
					<DomainWrapper>
						<DomainName>Custom link</DomainName>
						<DomainDescription>
							https://{project?.preferences?.domain ?? project?.id ?? ''}.notice.site
						</DomainDescription>
					</DomainWrapper>
					<Spacer />
					<OpenIcon size={18} color={theme.colors.grey} />
				</DomainContainer>

				<Button padding="12px 16px" onClick={onSkip}>
					Décrouvrir Notice
					<ArrowRight size={16} color={theme.colors.white} />
				</Button>
			</Footer>
		</Container>
	)
}

const Container = styled.div`
	padding: 24px 24px 12px 24px;
`

const LoadingContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding-bottom: 64px;
	gap: 12px;
	color: ${({ theme }) => theme.colors.primary};
`

const Title = styled.h1`
	font-weight: 700;
	font-size: 26px;
	text-align: center;
	color: ${({ theme }) => theme.colors.primaryDark};
`

const Subtitle = styled.p`
	padding: 0 128px;
	margin-top: 32px;
	margin-bottom: 32px;
	color: ${({ theme }) => theme.colors.textGrey};
	font-weight: 400;
`

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
`

const IntegrationGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;
	padding: 24px 0;
`

const Footer = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: flex-end;
	gap: 16px;
`

//----------------//
// Domain Styles //
//---------------//

const DomainContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12px;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.border};
	box-shadow: rgb(0 0 0 / 3%) 0px 3px 7px;
	padding: 4px 16px 4px 12px;

	cursor: pointer;

	&:hover {
		box-shadow: rgb(0 0 0 / 9%) 0px 3px 7px;
		transform: translateY(-3px);
	}

	transition:
		transform ease 0.25s,
		box-shadow ease 0.25s;
`

const DomainIcon = styled.img`
	width: 24px;
	height: 24px;
`

const DomainWrapper = styled.div``

const DomainName = styled.h2`
	font-size: 16px;
`

const DomainDescription = styled.p`
	font-size: 11px;
	color: ${({ theme }) => theme.colors.greyDark};
`
