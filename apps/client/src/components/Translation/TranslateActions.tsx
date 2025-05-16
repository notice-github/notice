import { BlockModel } from '@notice-app/models'
import { darken } from 'polished'
import { useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { useTranslateText } from '../../hooks/api/translate/useTranslateText'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useMarkCompleteLang } from '../../hooks/bms/translation/useMarkCompleteLang'
import { useSearchParams } from '../../hooks/useSearchParams'
import { NLanguages } from '../../utils/languages'
import { BetaTag } from '../BetaTag'
import { Row } from '../Flex'
import { MetaPlusRight } from '../KeyboardKey/KeyboardKey'
import { Loader } from '../Loader'
import { StatusIndicator, TranslationStatusTypes } from './TranslateToTopBar'
import { useT } from '../../hooks/useT'

interface Props {
	goToPreviousBlock: () => void
	goToNextBlock: () => void
	block: BlockModel.graph
	status: TranslationStatusTypes
	allBlocksMap: Record<string, BlockModel.graph>
	setBlockLangValue: (editorValue: any) => any
	setLoading: (bool: boolean) => any
	editor: any
	setTitleData: (data: any) => any
}

export function TranslateActions({
	goToPreviousBlock,
	goToNextBlock,
	block,
	status,
	allBlocksMap,
	setBlockLangValue,
	editor,
	setTitleData,
}: Props) {
	const [t] = useT()
	const [params] = useSearchParams()
	const theme = useTheme()

	const lang = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE

	const translateText = useTranslateText()

	const markComplete = useMarkCompleteLang(lang)
	const [project] = useCurrentProject()
	const defaultLang = project?.preferences?.defaultLanguage ?? 'en'

	const markCompleteAction = (complete: boolean) => {
		markComplete.mutateAsync({ block, complete })
	}

	function markAsCompleteAndGoToNext() {
		markCompleteAction(true)
		goToNextBlock()
	}

	// Escape and ArrowDown key handling
	const handleKeyDown = (e: KeyboardEvent) => {
		if ((e.metaKey || e.ctrlKey) && e.code === 'ArrowDown') {
			markAsCompleteAndGoToNext()
			return
		}

		if (e.key === 'ArrowDown' && e.shiftKey) {
			goToNextBlock()
			return
		}

		if (e.key === 'ArrowUp' && e.shiftKey) {
			goToPreviousBlock()
			return
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	})

	const autoTranslate = async () => {
		const isTitle = block.index === 0
		const defaultBlock = allBlocksMap[block.id] ?? block
		const newBlock = { ...defaultBlock }
		let content = ''

		if (isTitle) {
			content = defaultBlock.text
		} else {
			if (!newBlock?.children) return
			content = newBlock.children.reduce((acc: any, child: any) => {
				acc += child.text
				return acc
			}, '')
		}

		const res = await translateText.mutateAsync({ sourceLang: defaultLang, targetLang: lang, input: content })

		if (!res) return

		if (isTitle) {
			setTitleData({ title: res, lang })
			return
		} else {
			newBlock.children = [{ text: res }]
			setBlockLangValue([{ ...newBlock }])

			editor.focusEditor()
			editor.deleteTextBlock()
			editor.insertText(res)
		}
	}

	const autoTranslateOff = ['table', 'expandable'].includes(block.type)

	return (
		<ActionsWrapper>
			<ActionButton onClick={autoTranslate} disabled={autoTranslateOff}>
				<div>{t('Translate block', 'translateBlock')} 🧱</div>
				<Row align="center" gap="8px">
					{translateText.isLoading && <Loader size={20} color={theme.colors.primary} />}
				</Row>
			</ActionButton>

			{status === 'translated' ? (
				<ActionButton onClick={() => markCompleteAction(false)}>
					<Line>
						<StatusIndicator size="16px" status="notTranslated" style={{ marginRight: 8 }} />{' '}
						{t('Mark as incomplete', 'markAsIncomplete')}
					</Line>
				</ActionButton>
			) : (
				<ActionButton onClick={() => markCompleteAction(true)}>
					<Line>
						<StatusIndicator size="16px" status="translated" style={{ marginRight: 8 }} />{' '}
						{t('Mark as complete', 'markAsComplete')}
					</Line>
				</ActionButton>
			)}

			<ActionButton onClick={markAsCompleteAndGoToNext}>
				{t('Mark as complete and go to next', 'markAsCompleteAndGoToNext')}
				<MetaPlusRight />
			</ActionButton>
		</ActionsWrapper>
	)
}

const Line = styled.div`
	display: flex;
	align-items: center;
`

const ActionsWrapper = styled.div`
	gap: 8px;
	display: flex;
	flex-wrap: wrap;
	margin-top: 16px;
	flex-direction: column;
`

const ActionButton = styled.button<{ disabled?: boolean }>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 8px 12px;
	font-weight: 600;
	font-size: 15px;
	letter-spacing: 0.7px;
	height: 40px;

	width: 100%;

	outline-style: none;
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	background-color: ${({ theme, disabled }) => (disabled ? theme.colors.backgroundGrey : theme.colors.lightGrey)};
	color: ${({ theme }) => theme.colors.textDark};

	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

	* {
		${({ disabled }) => {
			if (!disabled) return
			return css`
				opacity: 0.8;
			`
		}}
	}

	white-space: nowrap;

	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

	${({ disabled }) => {
		if (disabled) return
		return css`
			&:hover {
				background-color: ${({ theme }) => darken(0.05, theme.colors.lightGrey)};
			}
		`
	}}
`
