import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'
import { InfoBanner } from '../../components/InfoBanner'
import { Loader } from '../../components/Loader'
import { Modals } from '../../components/Modal'
import { Page } from '../../components/Page'
import { PageBody } from '../../components/Page/PageBody'
import { PageContent } from '../../components/Page/PageContent'
import { PageHead, PageHeadDescription, PageHeadIcon, PageHeadTitle } from '../../components/Page/PageHead'
import { PageSide } from '../../components/Page/PageSide'
import { ProjectTree } from '../../components/ProjectTree/ProjectTree'
import { PublishButton } from '../../components/PublishButton'
import { Show } from '../../components/Show'
import { CardTranslator } from '../../components/Translation/CardTranslator'
import { DefaultLanguage } from '../../components/Translation/DefaultLanguage'
import { StatusIndicator } from '../../components/Translation/TranslateToTopBar'
import { UpgradeButton } from '../../components/UpgradeButton'
import { useSubscription } from '../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useEditorState } from '../../hooks/bms/editor/useEditorState'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useOnPropertyChange } from '../../hooks/bms/project/useOnPropertyChange'
import { useSearchParams } from '../../hooks/useSearchParams'
import { useT } from '../../hooks/useT'
import { Settings04 } from '../../icons'
import { InfoIcon } from '../../icons/InfoIcon'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { Pages } from '../../pages'
import { NLanguages } from '../../utils/languages'

export const TranslationsPage = () => {
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()
	const [currentPage] = useCurrentPage()
	const editorState = useEditorState(currentPage)

	useEffect(() => {
		if (workspace.myRole === 'viewer') {
			navigate(Pages.EDITOR, { replace: true })
		}
	}, [])

	// this loader ensures that the editor has saved all the data  before rendering the translation
	if (editorState !== 'saved') {
		return <LoadingState />
	}

	// we always need a page to be selected (this behavior is handled by the editor)
	// we wait for the page value to be fetched before rendering the translation
	// we'll need it
	if (!currentPage) return <></>

	return <Inside />
}

const Inside = () => {
	const [t] = useT()
	const [project] = useCurrentProject()
	const [onPropertyChange] = useOnPropertyChange()
	const theme = useTheme()
	const [params, setParams] = useSearchParams()
	const lang = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE
	const [workspace] = useCurrentWorkspace()
	const subscription = useSubscription(workspace)

	const { defaultLanguage, availableLanguages } = project?.preferences ?? {}

	useEffect(() => {
		// if there's a lang param, we don't need to set it
		if (lang) return

		// if there's no lang param, we set it to the first elem in the array of available languages
		if (availableLanguages?.length) {
			setParams({ lang: availableLanguages[0] }, { replace: false })
			return
		}

		// if there's no lang param and no available languages, we set it to english or french, depending on the default
		// if there's no default, let's wait for the user to pick one (normally undefined default can't happen here)
		if (defaultLanguage) {
			setParams({ lang: defaultLanguage !== 'en' ? 'en' : 'fr' }, { replace: false })
		}
	}, [])

	if (!project) return <LoadingState />

	return (
		<StyledPage minWidth="100vw" shouldBlur={false}>
			<PageSide style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
				<PageHead style={{ padding: '16px' }}>
					<PageHeadIcon src="/assets/svg/translation.svg" />
					<PageHeadTitle>{t('Translation', 'translation')}</PageHeadTitle>
					<PageHeadDescription>
						{t('Translate your content in more than 100 languages.', 'translationDescription')}{' '}
					</PageHeadDescription>
				</PageHead>

				<StyledPageBody>
					{project && (
						<ProjectTreeWrapper>
							<ProjectTree project={project} readOnly={true} theme="light" />
						</ProjectTreeWrapper>
					)}
					<Bottom>
						<ConfigureButton />
						<PublishButton fullWidth />
						<HelperIndications />
					</Bottom>
				</StyledPageBody>
			</PageSide>
			<StyledPageContent>
				{!defaultLanguage && <DefaultLanguage onPropertyChange={onPropertyChange} />}
				{defaultLanguage && (
					<>
						<CardTranslator />
						<InfoBanner
							background={theme.colors.primaryExtraLight}
							textColor={theme.colors.primary}
							content={
								<Centered>
									{t('You can select a block by clicking the', 'selectBlock')}
									<StatusIndicator status="notTranslated" size="12px"></StatusIndicator>
								</Centered>
							}
							iconColor={theme.colors.dark}
							width="47%"
						/>{' '}
					</>
				)}
			</StyledPageContent>
		</StyledPage>
	)
}

const Bottom = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 16px;
	border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`

const HelperIndications = () => {
	const [t] = useT()
	const theme = useTheme()

	return (
		<HelperWrapper>
			<Line margin="0 0 4px">
				<InfoIcon size={12} color={theme.colors.dark} />
				{t('Translation Status', 'translationStatus')}
			</Line>

			<Line>
				<StatusIndicator status="selected" size="12px"></StatusIndicator>
				{t('Selected', 'selected')}
			</Line>
			<Line>
				<StatusIndicator status="translated" size="12px"></StatusIndicator>
				{t('Translated', 'translated')}
			</Line>
			<Line>
				<StatusIndicator status="notTranslated" size="12px"></StatusIndicator>
				{t('Not translated', 'notTranslated')}
			</Line>
			<Line>
				<StatusIndicator status="outOfDate" size="12px"></StatusIndicator>
				{t('Translation out of date', 'translationOutOfDate')}
			</Line>
		</HelperWrapper>
	)
}

const HelperWrapper = styled.div`
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};

	border-radius: 8px;
	padding: 12px;

	display: flex;
	flex-direction: column;
	gap: 4px;
`

const ConfigureButton = () => {
	const [t] = useT()
	const theme = useTheme()

	return (
		<StyledConfigureButton onClick={() => Modals.translationConfiguration.open()}>
			<Settings04 size={14} color={theme.colors.textDark} />
			{t('Configure Translation', 'configureTranslation')}
		</StyledConfigureButton>
	)
}

const StyledConfigureButton = styled.div`
	display: flex;
	flex-grow: 0;
	align-items: center;
	box-sizing: border-box;

	gap: 8px;

	padding: 8px 8px;

	font-size: 14px;
	font-style: normal;
	font-weight: 600;
	letter-spacing: 0.5px;

	letter-spacing: 0.7px;
	width: 100%;
	border-radius: 8px;

	outline-style: none;
	border: none;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	color: ${({ theme }) => theme.colors.textDark};
	background-color: ${({ theme }) => theme.colors.white};

	white-space: nowrap;
	transition: 0.3s ease;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`

const Line = styled.div<{ margin?: string }>`
	display: flex;
	gap: 5px;
	align-items: center;

	font-size: 12px;
	font-style: normal;
	font-weight: 600;
	letter-spacing: 0.5px;
	margin: ${({ margin }) => margin};
`

const Centered = styled.div`
	display: flex;
	gap: 5px;
	align-items: center;
	justify-content: center;

	font-size: 14px;
	font-style: normal;
	font-weight: 600;
	letter-spacing: 0.5px;
	color: ${({ theme }) => theme.colors.primary};
`

const LoadingState = () => {
	return (
		<StyledPage minWidth="100vw" shouldBlur={false}>
			<Loader />
		</StyledPage>
	)
}

const StyledPage = styled(Page)<{ shouldBlur: boolean }>`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;

	filter: ${({ shouldBlur }) => (shouldBlur ? 'blur(3px)' : 'none')};
	pointer-events: ${({ shouldBlur }) => (shouldBlur ? 'none' : 'auto')};
	user-select: none;
`

const ProjectTreeWrapper = styled.div`
	background-color: ${({ theme }) => theme.colors.white};
`

const StyledPageContent = styled(PageContent)`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 0px;
	padding: 48px;
	box-sizing: border-box;
`

const StyledPageBody = styled(PageBody)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	flex-grow: 1;
	padding: 0;
`

interface Props {
	values: Record<string, string>[]
	currentValue: string
	displayName: (value: string) => string
	displayIcon?: (value: string) => React.ReactElement
	onUpdate?: (value: string) => any
}

interface MenuProps<T> extends Pick<Props, 'values' | 'displayName' | 'displayIcon'> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	onSelect?: (value: string) => any
}

const StyledUpgradeButton = styled(UpgradeButton)`
	position: absolute;
	top: calc(50% - 25px);
	left: calc(50% - 100px);
	width: 200px;
	height: 50px;
	z-index: 4;
	font-size: 21px;
`
