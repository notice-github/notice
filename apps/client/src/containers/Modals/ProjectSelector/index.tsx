import { NTime } from '@notice-app/utils'
import { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styled from 'styled-components'
import { Show } from '../../../components/Show'
import { MIXPANEL_TYPES, TEMPLATE_LIST } from '../../../data/templates'
import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useCreateFromTemplate } from '../../../hooks/api/useCreateFromTemplate'
import { useUser } from '../../../hooks/api/useUser'
import { useT } from '../../../hooks/useT'
import { ArrowLeft } from '../../../icons/ArrowLeft'
import { AiGenerationForm } from './AIGenerationForm'
import { GenerationTypeToggle } from './GenerationTypeToggle'
import { TemplateCard } from './TemplateCard'

export type TemplateType = (typeof TEMPLATE_LIST)[0]
export type SelectedOptionType = 'ai' | 'form' | 'template'

export const ProjectSelector = () => {
	const [t] = useT()
	const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
	const [selectedType, setSelectedType] = useState<SelectedOptionType>('template')
	const user = useUser()

	const [createFromTemplate, isLoading] = useCreateFromTemplate()
	const [abortController, setAbortController] = useState(new AbortController())
	const trackEvent = useTrackEvent()

	const handleTemplateSelection = (template: TemplateType) => {
		if (selectedType === 'ai') {
			setSelectedType('form')
			setSelectedTemplate(template)
		} else {
			setSelectedTemplate(template)
			createFromTemplate(template.name, template.templateId, template.mixpanelType)
		}
	}

	const handleTypeToggle = () => {
		if (selectedType === 'ai' || selectedType === 'form') {
			setSelectedTemplate(null)
			setSelectedType('template')
		} else {
			setSelectedType('ai')
		}
	}

	const handleAiSkip = () => {
		if (selectedTemplate === null) return

		abortController.abort()
		createFromTemplate(selectedTemplate.name, selectedTemplate.templateId, selectedTemplate.mixpanelType)
	}

	const onStartFromScratch = () => {
		abortController.abort()
		createFromTemplate('Blank Page', 'f0ce38e9-aa95-4de5-a980-90b2ff49c791', MIXPANEL_TYPES.raw)
	}

	const onBackToTemplateList = () => {
		setSelectedTemplate(null)
		setSelectedType('ai')
		abortController.abort()
		setAbortController(new AbortController())
	}

	return (
		<>
			<Container>
				<Title>{t('Select Your Project', 'selectYourProject')}</Title>
				<MainWrapper>
					<GenerationTypeToggle selectedType={selectedType} onToggle={handleTypeToggle} />
					<TransitionOuterWrap>
						<SwitchTransition mode="out-in">
							<CSSTransition
								key={selectedType as any}
								addEndListener={(node, done) => {
									node.addEventListener('transitionend', done, false)
								}}
								timeout={{
									appear: 150,
									enter: 200,
									exit: 250,
								}}
								classNames={selectedType !== 'ai' ? 'slide-right' : 'slide-left'}
							>
								<TransitionInnerWrap>
									<Show when={selectedType === 'template'}>
										<GridArea>
											{TEMPLATE_LIST.map((template) => {
												return (
													<TemplateCard
														key={template.id}
														onClick={() => {
															if (!isLoading) {
																handleTemplateSelection(template)
															}
														}}
														icon={template.icon}
														name={template.name}
														color={template.color}
														variant="preFilled"
														isLoading={isLoading && selectedTemplate?.templateId === template.templateId}
													/>
												)
											})}
										</GridArea>
									</Show>

									<Show when={selectedType === 'ai'}>
										<GridArea>
											{TEMPLATE_LIST.map((template) => {
												return (
													<TemplateCard
														key={template.id}
														onClick={() => handleTemplateSelection(template)}
														icon={template.icon}
														name={template.name}
														color={template.color}
														variant="ai"
													/>
												)
											})}
										</GridArea>
									</Show>

									<Show when={selectedType === 'form'}>
										<FormWrapper>
											<AiGenerationForm
												abortController={abortController}
												onSkip={handleAiSkip}
												template={selectedTemplate}
											/>
										</FormWrapper>
									</Show>
								</TransitionInnerWrap>
							</CSSTransition>
						</SwitchTransition>
					</TransitionOuterWrap>
				</MainWrapper>
			</Container>
			<Footer>
				<Show when={selectedType === 'form'}>
					<LinkButton onClick={onBackToTemplateList} color={selectedTemplate?.color}>
						<StyledArrowLeft size={18} />
						{t('Back to list', 'backToList')}
					</LinkButton>
				</Show>
				<LinkButton margin="0 0 0 auto" onClick={onStartFromScratch}>
					{t('Start from scratch', 'startFromScratch')}
				</LinkButton>
			</Footer>
		</>
	)
}

const StyledArrowLeft = styled(ArrowLeft)`
	transform: rotate(180deg);
`

const Container = styled.div`
	width: 550px;
	user-select: none;
	padding: 24px 24px 12px 24px;
`

const Title = styled.h1`
	font-style: normal;
	font-weight: 700;
	font-size: 26px;
`
const MainWrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	position: relative;

	border: 1px solid transparent;
`

const TransitionOuterWrap = styled.div`
	box-sizing: border-box;
	margin-bottom: 12px;

	.slide-right-enter {
		opacity: 0;
		transform: translateX(-100%);
	}

	.slide-left-enter {
		opacity: 0;
		transform: translateX(100%);
	}

	.slide-right-enter-active,
	.slide-left-enter-active {
		opacity: 1;
		transform: translateX(0%);
	}
	.slide-right-exit,
	.slide-left-exit {
		opacity: 1;
		transform: translateX(0%);
	}

	.slide-right-exit-active {
		opacity: 0;
		transform: translateX(-100%);
	}

	.slide-left-exit-active {
		opacity: 0;
		transform: translateX(100%);
	}

	.slide-right-enter-active,
	.slide-right-exit-active,
	.slide-left-enter-active,
	.slide-left-exit-active {
		transition:
			opacity 200ms,
			transform 200ms;
	}
`
const TransitionInnerWrap = styled.div`
	height: 380px;
	box-sizing: border-box;
`

const GridArea = styled.div`
	box-sizing: border-box;

	display: grid;
	grid-template-columns: repeat(3, 167px);
	grid-template-rows: repeat(4, auto);
	grid-column-gap: 14px;
	grid-row-gap: 14px;
	justify-content: center;

	margin: 24px auto;
	width: 100%;
	height: 100%;
`

const FormWrapper = styled.div`
	width: 100%;
	height: 100%;
	margin: auto;
`

const Footer = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: fit-content;

	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: 4px 12px;
	border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const LinkButton = styled.div<{ margin?: string }>`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: end;
	color: ${({ theme }) => theme.colors.textLightGrey};
	padding: 6px;

	cursor: pointer;

	svg {
		transform: rotate(180deg);
	}

	svg path {
		fill: ${({ theme }) => theme.colors.textLightGrey};
	}

	&:hover {
		color: ${({ theme }) => theme.colors.primary};

		svg path {
			fill: ${({ theme }) => theme.colors.primary};
		}
	}

	margin: ${({ margin }) => margin};
`
