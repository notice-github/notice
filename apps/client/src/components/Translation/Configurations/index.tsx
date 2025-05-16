import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { useT } from '../../../hooks/useT'
import { Pages } from '../../../pages'
import { AlertBox } from '../../AlertBox'
import InlineCode from '../../InlineCode'
import { Modals } from '../../Modal'
import { AvailableLanguagesSection } from './AvailableLanguagesSection'
import { DefaultLanguageSection } from './DefaultLanguageSection'
import { ToggleSectionsTemplate } from './ToggleSectionsTemplate'

interface Props {}

export const TranslationConfiguration = ({}: Props) => {
	const [t] = useT()
	const [onPropertyChange] = useOnPropertyChange()
	const [project] = useCurrentProject()
	const { addLangQuery } = project?.preferences || {}
	const { top_space } = project?.layout || {}
	const { show, language_selector } = top_space || {}

	const navigate = useNavigate()

	const onClick = () => {
		Modals.translationConfiguration.close()
		navigate(Pages.CUSTOMIZATION_LAYOUT)
	}

	const handleDisplaySelector = (value: boolean) => {
		if (show) {
			onPropertyChange('layout', 'top_space', { language_selector: { show: value } })
		} else {
			onPropertyChange('layout', 'top_space', { show: true, language_selector: { show: value } })
		}
	}

	return (
		<FlexContainer>
			<Title>{t('Configure Your Translation', 'configureYourTranslation')}</Title>
			<FlexColumn gap="32px">
				<ToggleSectionsTemplate
					title={t('Language Selector', 'languageSelector')}
					description={
						<span>{t('Allow users to change the language of your project.', 'allowUsersToChangeLang')}</span>
					}
					toggled={language_selector?.show ?? false}
					onToggleChange={handleDisplaySelector}
				/>

				<ToggleSectionsTemplate
					title={t('Add language query to url', 'addLanguageQueryToUrl')}
					description={
						<span>
							{t('Adds a lang query like', 'addsALangQueryLike')} <InlineCode>lang='en'</InlineCode>{' '}
							{t('to your project url.', 'toYourProjectUrl')}
						</span>
					}
					toggled={addLangQuery ?? false}
					onToggleChange={(value) => {
						onPropertyChange('preferences', 'addLangQuery', value)
					}}
				/>

				<DefaultLanguageSection onPropertyChange={onPropertyChange} />
				<AvailableLanguagesSection onPropertyChange={onPropertyChange} />
			</FlexColumn>
			<AlertBox margin="0">
				<Description>
					{t('The language selector can also be managed in your top space layout by', 'languageSelectorWarning')}{' '}
					<NakedButton onClick={onClick}>{t('cliking here', 'clickingHere')}</NakedButton>.
				</Description>
			</AlertBox>
		</FlexContainer>
	)
}

const FlexContainer = styled.div`
	box-sizing: border-box;

	width: 600px;
	padding: 32px;
`

const FlexColumn = styled.div<{ gap: string }>`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;
	gap: ${({ gap }) => gap};
	box-sizing: border-box;
`
const Title = styled.h1`
	font-size: 28px;
	font-weight: 700;
	margin-bottom: 24px;
`

const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.dark};
`

const NakedButton = styled.a`
	text-decoration: none;
	border: none;
	background-color: transparent;
	cursor: pointer;

	font-size: 14px;
	font-weight: 400;
	padding: 0;

	color: ${({ theme }) => theme.colors.mariner};

	&:hover {
		text-decoration: underline;
	}
`
