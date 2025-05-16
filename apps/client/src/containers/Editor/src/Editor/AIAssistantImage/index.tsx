import { useSlate } from 'slate-react'
import styled, { useTheme } from 'styled-components'
import { useT } from '../../../../../hooks/useT'
import { AIIcon } from '../../../../../icons/ProjectIcons'
import { insertNoticeAIImagePrompt } from '../Blocks/NoticeAI/NoticeAIImagePrompt'
import { useState } from 'react'
import { Loader } from '../Components/Loader/Loader'
import { useEditorMethods } from '../Contexts/EditorMethods.provider'
import { getTextFromNodes } from '../Blocks/helpers'

export type DestroyElement = () => void

export const CreateImageWithAICTA = () => {
	// A loading local state
	const [loading, setLoading] = useState(false)
	const { imageSuggestion } = useEditorMethods()

	const theme = useTheme()
	const editor = useSlate()
	const [t] = useT()

	const askForImageDescription = async () => {
		setLoading(true)

		try {
			// Max words is 4096 in the API
			const text = getTextFromNodes(editor.children).slice(0, 4080)
			const suggestion = imageSuggestion ? await imageSuggestion(text) : 'No imageSuggestion provided'
			insertNoticeAIImagePrompt(editor, null, suggestion, [0])
		} catch (e) {
			console.error(e)
		}
		setLoading(false)
	}

	return (
		<CreateAIWrapper>
			<CreateAIButton>
				<div>
					<AIIcon size={16} color={theme.colors.sweetpurple} />
				</div>
				<CreateAIText onClick={askForImageDescription}>
					{loading
						? t('AI is generating an image idea...', 'AIIsGeneratingAnImageIdea')
						: t('Create an image inspired by this page', 'LetOurAICreateImage')}
				</CreateAIText>
			</CreateAIButton>{' '}
			{loading && (
				<LoaderWrapper>
					<Loader size={17} color={theme.colors.sweetpurple} />
				</LoaderWrapper>
			)}
		</CreateAIWrapper>
	)
}

const LoaderWrapper = styled.div`
	display: flex;
	align-items: center;
	padding-left: 8px;
`

const CreateAIText = styled.span`
	margin-left: 12px;
`

const CreateAIButton = styled.div`
	display: flex;
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
