import { NLanguages } from '../../utils/languages'
import { darken } from 'polished'
import { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ChevronIcon } from '../../icons/ChevronIcon'
import { Menu } from '../Menu'
import { MenuItem } from '../Menu/MenuItem'

interface LanguageSelectorProps {
	initialValue: NLanguages.LANGUAGE_CODES_TYPE
	onChange: (value: string) => any
	buttonStyle?: CSSProperties
	availableLanguages?: Array<NLanguages.LANGUAGE_CODES_TYPE>
}

export function LanguageSelector({
	initialValue,
	onChange,
	buttonStyle,
	availableLanguages = [],
}: LanguageSelectorProps) {
	const [lang, setLang] = useState(initialValue)
	const theme = useTheme()
	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (initialValue) setLang(initialValue)
	}, [initialValue])

	return (
		<div>
			<TranslateToContainer>
				<Button style={buttonStyle} ref={setRef} onClick={() => setMenuOpened(true)}>
					{lang ? NLanguages.LANGUAGES[lang]?.name : 'Select a language'}
					<ChevronIcon color={theme.colors.textDark} size={14} style={{ transform: 'rotate(90deg)' }} />
				</Button>
			</TranslateToContainer>

			{menuOpened && (
				<LanguageMenu
					anchorRef={ref}
					setMenuOpened={setMenuOpened}
					onChange={(val: any) => {
						onChange(val)
						setLang(val)
					}}
					availableLanguages={availableLanguages}
				/>
			)}
		</div>
	)
}

const TranslateToContainer = styled.div`
	display: flex;
	align-items: center;
`

interface LanguageMenuProps {
	anchorRef: HTMLButtonElement | null
	setMenuOpened: Dispatch<SetStateAction<boolean>>
	onChange: (value: string) => any
	availableLanguages?: Array<NLanguages.LANGUAGE_CODES_TYPE>
}

const LanguageMenu = ({ anchorRef, setMenuOpened, onChange, availableLanguages = [] }: LanguageMenuProps) => {
	const [closing, setClosing] = useState(false)

	const onClickLang = (languageCode: string) => {
		onChange(languageCode)
		setClosing(true)
		setMenuOpened(false)
	}

	const displayAvaiLangs = availableLanguages && availableLanguages.length

	const elems = [
		displayAvaiLangs && <MenuSectionTitle key="availableLanguagesMenuTitle">Your Languages</MenuSectionTitle>,
		...availableLanguages.map((langCode) => {
			if (!NLanguages.LANGUAGES[langCode]) return null
			const { name, languageCode } = NLanguages.LANGUAGES[langCode]
			return <MenuItem key={name + 'availableList'} text={name} onClick={() => onClickLang(languageCode)} />
		}),
		displayAvaiLangs && <MenuSectionTitle key="allLanguagesMenuTitle">All Languages</MenuSectionTitle>,
		...Object.entries(NLanguages.LANGUAGES).map((lang) => {
			const { name, languageCode } = lang[1]
			return <MenuItem key={name} text={name} onClick={() => onClickLang(languageCode)} />
		}),
	].filter((el) => el)

	return (
		<Menu
			searchable
			searchPlaceholder="Search Language"
			closing={closing}
			anchorRef={anchorRef}
			placement="bottom"
			offset={[0, 2]}
			onClose={() => setMenuOpened(false)}
		>
			{elems}
		</Menu>
	)
}

const MenuSectionTitle = styled.div`
	padding: 12px 16px;
	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.textGrey};
	font-size: 11px;
	font-weight: 400;
`

interface LanguageMenuItemProps {
	language: NLanguages.LanguageInfo
	onClick: (value: any) => any
	uniqueKey?: string
}

const LanguageMenuItem = ({ language, onClick, uniqueKey }: LanguageMenuItemProps) => {
	const { name, languageCode } = language

	return <MenuItem key={uniqueKey ?? name} text={name} onClick={() => onClick(languageCode)} />
}

const Button = styled.button`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 8px 8px;

	outline-style: none;
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	/* border: 1px solid ${({ theme }) => theme.colors.borderLight}; */

	background-color: ${({ theme }) => theme.colors.white};

	font-size: 14px;
	color: ${({ theme }) => theme.colors.textDark};
	white-space: nowrap;

	cursor: pointer;

	&:hover {
		background-color: ${({ color }) => darken(0.05, color ?? 'white')};
	}
`
