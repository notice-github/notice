import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Button } from '../Button'
import { LanguageSelector } from './LanguageSelector'
import { OnPropertyChange } from '../../hooks/bms/project/useOnPropertyChange'
import { useT } from '../../hooks/useT'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const DefaultLanguage = ({ onPropertyChange }: Props) => {
	const [t] = useT()
	const [lang, setLang] = useState('en')
	const theme = useTheme()

	return (
		<Wrapper>
			<h2>{t('Select this project default language', 'selectProjectLanguage')}</h2>
			<LanguageSelector
				initialValue={lang}
				onChange={(val) => setLang(val)}
				buttonStyle={{ border: `1px solid ${theme.colors.borderLight}` }}
			/>
			<Button
				onClick={() => {
					onPropertyChange('preferences', 'defaultLanguage', lang)
					// display the language selector as soon as the user selects a language
					onPropertyChange('layout', 'top_space', { show: true, language_selector: { show: true } })
					window.location.reload()
				}}
			>
				{t('Validate', 'validate')}
			</Button>
			<i>{t('Hint: this is the language of your current project.', 'selectLanguageHint')}</i>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 16px;
`
