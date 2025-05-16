import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { TemplateType } from '..'
import { Button } from '../../../../components/Button'
import { Show } from '../../../../components/Show'

import { useTrackEvent } from '../../../../hooks/analytics/useTrackEvent'
import { useAIGeneration } from '../../../../hooks/api/ai/useAIGeneration'
import { useCurrentWorkspace } from '../../../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../../../hooks/api/useUser'
import { useT } from '../../../../hooks/useT'
import { ChevronIcon } from '../../../../icons/ChevronIcon'
import { Consts } from '../../../../utils/consts'
import { isCorporateEmail } from '../../../../utils/tools'
import { ProgressIndicator } from '../ProgressIndicator'
import { AIDomainInput } from './AIDomainInput'
import { AIPromptInput } from './AIPromptInput'

export interface Props {
	template: TemplateType | null
	onSkip: () => void
	abortController: AbortController
}

export const AiGenerationForm = ({ template, abortController, onSkip }: Props) => {
	const [t] = useT()
	const user = useUser()
	const trackEvent = useTrackEvent()
	const theme = useTheme()

	const [currentWorkspace] = useCurrentWorkspace()
	const [aiGenerationMutation, isCreatingProject] = useAIGeneration()

	const isProEmail = isCorporateEmail(user.email)

	const [domain, setDomain] = useState(isProEmail ? user.email?.split('@')?.[1] ?? '' : '') // add domain here if its business
	const [prompt, setPrompt] = useState('')
	const [expanded, setExpanded] = useState(false)

	const isValidDomain = () => {
		if (!domain) return true
		return Consts.WEBSITE_REGEX.test(domain)
	}

	const getCleanAndValidDomain = () => {
		const isValid = Consts.WEBSITE_REGEX.test(domain)
		const isEmpty = domain.trim().length === 0

		if (isValid && !isEmpty) {
			return new URL(domain.startsWith('https://') ? domain : `https://${domain}`)
		}
		return null
	}

	if (template === null) return

	const onSubmit = async () => {
		const domain = getCleanAndValidDomain()

		if (!domain && !prompt) return

		aiGenerationMutation.mutateAsync({
			domain: domain ? domain.host : null,
			url: domain ? domain.href : null,
			template: {
				name: template.name as string,
				id: template.templateId,
				customFormat: template.customFormat,
				customInstruction: template.customInstruction,
				generateImage: template?.generateImage,
			},
			context: prompt.length > 0 ? prompt : undefined,
			workspace: currentWorkspace,
			abortController: abortController,
			selectedTemplate: template,
		})
	}

	const onDomainEnter = () => {
		if (!domain || !isValidDomain()) return
		onSubmit()
	}

	const onPromptEnter = () => {
		if (!prompt.trim()) return
		onSubmit()
	}

	const inputTypeSelector = (type: 'prompt' | 'domain') => {
		switch (type) {
			case 'domain':
				return (
					<AIDomainInput
						template={template}
						value={domain}
						onChange={(value) => setDomain(value)}
						isOptional={!isProEmail}
						onEnter={onDomainEnter}
					/>
				)
			case 'prompt':
			default:
				return (
					<AIPromptInput
						template={template}
						value={prompt}
						onChange={(value) => setPrompt(value)}
						isOptional={isProEmail}
						onEnter={onPromptEnter}
					/>
				)
		}
	}

	return (
		<Container>
			<Header color={template.color}>{`${t('Help our AI generate your', 'helpOurAIGenerateYour')} ${
				template.name
			}`}</Header>
			<FormGroup>
				{inputTypeSelector(isProEmail ? 'domain' : 'prompt')}
				<ExpandableWrapper>
					<ExpandableHeader isExpanded={expanded} onClick={() => setExpanded((value) => !value)}>
						<h4 style={{ marginRight: 8 }}>{t('Advanced', 'advanced')}</h4>

						<ChevronIcon size={18} color={expanded ? theme.colors.primaryDark : theme.colors.textGrey} />
					</ExpandableHeader>

					<ExpandableContent isExpanded={expanded}>
						<OverflowHidden>{inputTypeSelector(!isProEmail ? 'domain' : 'prompt')}</OverflowHidden>
					</ExpandableContent>
				</ExpandableWrapper>

				<SubmitButton disabled={(!prompt && !domain) || !isValidDomain()} padding="8px 16px" onClick={onSubmit}>
					Submit
				</SubmitButton>
			</FormGroup>
			<Show when={aiGenerationMutation.isLoading || isCreatingProject}>
				<ProgressIndicator onSkip={onSkip} delay={90} selectedTemplate={template} />
			</Show>
		</Container>
	)
}

const Container = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;

	padding: 0 12px;
`

const Header = styled.div<{ color: string }>`
	color: ${({ color }) => color};
	font-size: 18px;
	font-weight: 700;
	margin-bottom: 8px;
`

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	width: 100%;
`

const SubmitButton = styled(Button)`
	margin-left: auto;
`

const ExpandableWrapper = styled.div`
	width: 100%;
	margin: 6px 0;

	height: fit-content;
`

const ExpandableHeader = styled.div<{ isExpanded: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;

	width: 100%;
	padding: 12px 0;
	cursor: pointer;
	color: ${({ theme, isExpanded }) => (isExpanded ? theme.colors.primaryDark : theme.colors.textGrey)};
	transition: all 0.2s ease;

	svg {
		transform: ${({ isExpanded }) => (isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)')};
		transition: transform 0.2s ease;
	}

	&:hover {
		color: ${({ theme }) => theme.colors.primaryDark};

		svg path {
			stroke: ${({ theme }) => theme.colors.primaryDark};
		}
	}
`

const ExpandableContent = styled.div<{ isExpanded: boolean }>`
	display: grid;
	grid-template-rows: ${({ isExpanded }) => (isExpanded ? '1fr' : '0fr')};
	transition: grid-template-rows 500ms;
`

const OverflowHidden = styled.div`
	overflow: hidden;
`

export const FormTitle = styled.div`
	font-size: 14px;
	font-weight: 700;
	line-height: 24px;
	color: ${({ theme }) => theme.colors.textGrey};
`

export const Subtitle = styled.div`
	font-size: 13px;
	font-weight: 500;

	line-height: 24px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`
