import { marked } from 'marked'
import React, { useState } from 'react'
import { useSlate } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { useT } from '../../../../../hooks/useT'
import { AIIcon } from '../../../../../icons/ProjectIcons'
import { Pages } from '../../../../../pages'
import { Router } from '../../../../../router'
import { insertNoticeAITextPrompt } from '../Blocks/NoticeAI/NoticeAITextPrompt'
import { useEditorMethods } from '../Contexts/EditorMethods.provider'
import { MarkdownResponse } from './MarkdownResponse'
import { DoneActions, UserPrompt } from './UserPrompt'
import { useTrackEvent } from '../../../../../hooks/analytics/useTrackEvent'
import { useUser } from '../../../../../hooks/api/useUser'

export type DestroyElement = () => void
interface Props {
	destroyElement: DestroyElement
	status: 'idle' | 'loading' | 'done'
	setStatus: (status: 'idle' | 'loading' | 'done') => void
	insertMarkdown: (md: string) => void
}

export const AIAssistant = ({ destroyElement, status, setStatus, insertMarkdown }: Props) => {
	const [inputValue, setInputValue] = useState('')
	const [markdownResponse, setMdResponse] = useState('')
	const { generateAIPage } = useEditorMethods()
	const user = useUser()

	const [t] = useT()

	const addResponse = (response: string) => {
		setMdResponse((r) => r + response)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(event.target.value)
	}

	const handleSubmit = () => {
		generatePrompt()
	}

	const generatePrompt = async () => {
		setInputValue('')
		setStatus('loading')
		try {
			const res: any = generateAIPage
				? await generateAIPage(inputValue, addResponse, destroyElement)
				: 'No generateAIPage method provided.'
			setStatus('done')
		} catch (e) {
			setStatus('done')
		}
	}

	const keepResponse = () => {
		insertMarkdown(marked(markdownResponse, { silent: true }))
		destroyElement()
	}

	const retryInput = () => {
		setInputValue('')
		setMdResponse('')
		setStatus('idle')
	}

	return (
		<Wrapper>
			<PromptWrapper>
				<UserPrompt
					inputValue={inputValue}
					handleSubmit={handleSubmit}
					handleInputChange={handleInputChange}
					status={status}
					destroyElement={destroyElement}
					keepResponse={keepResponse}
					retryInput={retryInput}
				/>
				{status !== 'idle' && <MarkdownResponse markdown={markdownResponse} />}
				{/* If the response is long, we display a second actions bar */}
				{status === 'done' && markdownResponse.length > 400 && (
					<DoneActions destroyElement={destroyElement} keepResponse={keepResponse} retryInput={retryInput} />
				)}
			</PromptWrapper>
			<ActionBox>
				<LinkButton onClick={() => Router._router.navigate(Pages.SETTINGS_NOTICE_IA)}>
					{t('Change AI Settings', 'changeAISettings')}
				</LinkButton>
			</ActionBox>
		</Wrapper>
	)
}
const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	border-radius: 5px;

	width: 100%;
	max-width: fill-available;
	box-shadow:
		rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
		rgba(15, 15, 15, 0.1) 0px 3px 6px,
		rgba(15, 15, 15, 0.2) 0px 9px 24px;
`
const PromptWrapper = styled.div`
	width: 100%;
	max-width: fill-available;
	font-size: 16px;
	border-radius: 5px;
	border: none;
	box-sizing: border-box;
	padding: 10px 10px 10px 10px;
	margin-left: 0px;
`

export const CreateWithAICTA = () => {
	const theme = useTheme()
	const editor = useSlate()
	const [t] = useT()

	return (
		<CreateAIWrapper onClick={() => insertNoticeAITextPrompt(editor)}>
			<div>
				<AIIcon size={16} color={theme.colors.yellorange} />
			</div>
			<CreateAIText>{t('Let our AI create your page', 'LetOurAICreate')}</CreateAIText>
		</CreateAIWrapper>
	)
}

const CreateAIText = styled.span`
	margin-left: 12px;
`

const CreateAIWrapper = styled.div<any>`
	display: flex;
	max-width: fill-available;
	font-size: 16px;
	border-radius: 5px;
	border: none;
	box-sizing: border-box;
	margin-left: 30px;
	color: ${({ theme }) => theme.colors.grey};
	padding: 4px 8px 4px 8px;
	cursor: pointer;
	:hover {
		background-color: ${({ theme }) => theme.colors.backgroundHoverGrey};
	}
	width: fit-content;
	font-size: 14.5px;
`
const ActionBox = styled.div`
	width: 100%;
	max-width: fill-available;

	display: flex;
	justify-content: flex-end;
	align-items: center;
	background-color: rgb(249, 249, 248);

	border-radius: 0 0 5px 5px;

	border: none;
	box-sizing: border-box;
	padding: 4px;
`
const LinkButton = styled.div`
	margin: 4px 8px;
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textGrey};

	transition: all 0.2s ease;
	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};
	}
`
