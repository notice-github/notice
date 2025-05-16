import { darken } from 'polished'
import { useNavigate } from 'react-router-dom'
import styled, { css, useTheme } from 'styled-components'
import { usePageTranslate } from '../../hooks/api/translate/usePageTranslate'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useSearchParams } from '../../hooks/useSearchParams'
import { Translate01 } from '../../icons'
import { Pages } from '../../pages'
import { NLanguages } from '../../utils/languages'
import { BetaTag } from '../BetaTag'
import { Row } from '../Flex'
import { Loader } from '../Loader'
import { LanguageSelector } from './LanguageSelector'
import { useAvailableLanguages } from './useUpdateAvailableLanguages'
import { useT } from '../../hooks/useT'

export type TranslationStatusTypes = 'translated' | 'notTranslated' | 'selected' | 'outOfDate'

export function TranslateToTopBar() {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()
	const [page] = useCurrentPage()
	const [params, setParams] = useSearchParams()
	const [availableLanguages, updateAvailableLanguages] = useAvailableLanguages()
	const lang = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE
	const theme = useTheme()
	const navigate = useNavigate()

	const translatePage = usePageTranslate()

	async function changeTranslateToLanguage(val: string) {
		if (!project || !workspace) return
		setParams({ lang: val }, { replace: false })
		updateAvailableLanguages(val)
	}

	const testTranslate = async () => {
		if (!page?.id || !project?.id) return

		if (workspace.subscription === 'free') {
			navigate(Pages.SETTINGS_SUBSCRIPTION)
			return
		}

		translatePage.mutateAsync({
			langCode: lang,
			langName: NLanguages.LANGUAGES[lang]?.name,
			projectId: project?.id,
			pageId: page?.id,
		})
		if (!availableLanguages.includes(lang)) updateAvailableLanguages(lang)
	}

	return (
		<SelectLanguageWrapper>
			<Row align="center" gap={12}>
				<FlexWrapper>
					<TranslateToText>{t('Translate to', 'translateTo')}</TranslateToText>
					<LanguageSelector
						initialValue={lang ?? 'en'}
						onChange={changeTranslateToLanguage}
						availableLanguages={availableLanguages}
					/>
				</FlexWrapper>
			</Row>
			<Row align="center" justify="center" gap={8}>
				<TranslatePageButton onClick={testTranslate} isDisabled={translatePage.isLoading}>
					{translatePage.isLoading ? (
						<Loader size={20} color={theme.colors.white} />
					) : (
						<Translate01 color={theme.colors.white} size={20} />
					)}

					<span>{t('Translate this page', 'translateThisPage')}</span>
				</TranslatePageButton>
			</Row>
		</SelectLanguageWrapper>
	)
}

export const StatusIndicator = styled.div<{ status?: TranslationStatusTypes; size?: string }>`
	height: ${({ size }) => size ?? '20px'};
	width: ${({ size }) => size ?? '20px'};
	border-radius: 50%;
	${({ status }) => {
		switch (status) {
			case 'translated':
				return css`
					background-color: ${({ theme }) => theme.colors.success};
				`
			case 'notTranslated':
				return css`
					background-color: ${({ theme }) => theme.colors.grey};
				`
			case 'outOfDate':
				return css`
					background-color: ${({ theme }) => theme.colors.warning};
				`
			default:
				return css`
					background-color: ${({ theme }) => theme.colors.primaryLight};
				`
		}
	}}
`

const TranslateToText = styled.div`
	margin-right: 8px;
`

const FlexWrapper = styled.div`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.primaryLighter};
	color: ${({ theme }) => theme.colors.primary};

	width: fit-content;
	border-radius: 8px;
	padding: 4px 8px;
`

const TranslatePageButton = styled.div<{ isDisabled: boolean }>`
	display: flex;
	flex-direction: row;
	gap: 4px;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.primary};
	padding: 8px;
	opacity: 1;

	width: fit-content;
	border-radius: 8px;

	cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
	pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

	transition: 0.3s ease;
	color: ${({ theme }) => theme.colors.white};

	&:hover {
		background-color: ${({ theme, isDisabled }) => (isDisabled ? undefined : darken(0.1, theme.colors.primary))};
	}
`

const SelectLanguageWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`
