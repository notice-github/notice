import styled, { useTheme } from 'styled-components'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { Modals } from '../../Modal'
import { LanguageSelector } from '../LanguageSelector'
import { useT } from '../../../hooks/useT'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const DefaultLanguageSection = ({ onPropertyChange }: Props) => {
	const theme = useTheme()
	const [t] = useT()

	const [project] = useCurrentProject()
	const { availableLanguages, defaultLanguage } = project?.preferences || {}
	const initialLanguages = availableLanguages ?? []
	const handleSelection = (val: string) => {
		onPropertyChange('preferences', 'defaultLanguage', val)
		// save the default language to available languages
		onPropertyChange('preferences', 'availableLanguages', [...initialLanguages, val])
	}

	return (
		<FlexRow>
			<FlexColumn gap="4px">
				<SectionTitle>{t('Choose a default language', 'chooseADefaultLanguage')}</SectionTitle>
				<Description>
					{t('If you want more languages', 'ifYouWantMoreLanguages')}
					<NakedButton onClick={() => Modals.contactUs.open()}>{t('let us know.', 'letUsKnow')}</NakedButton>
				</Description>
			</FlexColumn>
			<LanguageSelector
				initialValue={defaultLanguage}
				onChange={(val) => handleSelection(val)}
				buttonStyle={{ border: `1px solid ${theme.colors.borderLight}` }}
			/>
		</FlexRow>
	)
}

const FlexColumn = styled.div<{ gap: string }>`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;
	gap: ${({ gap }) => gap};
	box-sizing: border-box;
`

const FlexRow = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const Title = styled.h1`
	font-size: 28px;
	font-weight: 700;
	margin-bottom: 24px;
`

const SectionTitle = styled.h4`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.primaryDark};
`

const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textGrey};
`

const NakedButton = styled.button`
	text-decoration: none;
	border: none;
	background-color: transparent;
	cursor: pointer;

	font-size: 14px;
	font-weight: 400;

	color: ${({ theme }) => theme.colors.mariner};

	&:hover {
		text-decoration: underline;
	}
`
