import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { PlusIcon } from '../../../icons'
import { OnPropertyChange } from '../../../pages/Translations'
import { NLanguages } from '../../../utils/languages'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'
import Tag from '../../Tag'
import { useT } from '../../../hooks/useT'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const AvailableLanguagesSection = ({ onPropertyChange }: Props) => {
	const [project] = useCurrentProject()
	const [t] = useT()
	const availableLanguages = (project?.preferences?.availableLanguages as Array<NLanguages.LANGUAGE_CODES_TYPE>) ?? []
	const defaultLanguage = project?.preferences?.defaultLanguage

	const filteredAvailableLanguages = useMemo(
		() =>
			availableLanguages?.filter(
				(lang, index) => lang !== defaultLanguage && availableLanguages.indexOf(lang) === index
			),
		[availableLanguages, defaultLanguage]
	)
	const handleAddNew = (value: string) => {
		const newAvailableLanguages = [...filteredAvailableLanguages, value]
		onPropertyChange('preferences', 'availableLanguages', newAvailableLanguages)
	}

	const handleLanguageDeletion = (index: number) => {
		const availableLanguagesCopy = [...filteredAvailableLanguages]
		availableLanguagesCopy.splice(index, 1)
		onPropertyChange('preferences', 'availableLanguages', availableLanguagesCopy)
	}

	return (
		<FlexColumn gap="4px">
			<SectionTitle>{t('Available Languages', 'availableLanguages')}</SectionTitle>
			<LanguagesContainer noData={!availableLanguages?.length && !defaultLanguage}>
				{defaultLanguage && <Tag variant="disabled" value={NLanguages.LANGUAGES[defaultLanguage].name}></Tag>}
				{filteredAvailableLanguages !== undefined &&
					filteredAvailableLanguages?.map((lang, index) => (
						<Tag
							onDelete={() => handleLanguageDeletion(index)}
							key={`${lang} - ${index}`}
							value={NLanguages.LANGUAGES[lang]?.name}
						></Tag>
					))}
				<AvailableLanguageSelector
					noData={!availableLanguages?.length && !defaultLanguage}
					onChange={(value) => handleAddNew(value)}
				/>
			</LanguagesContainer>
		</FlexColumn>
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

const SectionTitle = styled.h4`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.primaryDark};
`

const LanguagesContainer = styled.div<{ noData: boolean }>`
	box-sizing: border-box;

	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	padding: 16px;
	margin: 12px 0;

	height: 100%;
	width: 100%;
	gap: 8px;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: ${({ theme }) => theme.borderRadius};
`

const Button = styled.div<{ noData: boolean }>`
	padding: 4px 6px;
	border-radius: 4px;
	color: ${({ theme }) => theme.colors.white};
	background: ${({ theme }) => theme.colors.primaryDark};
	user-select: none;
	margin-bottom: ${({ noData }) => (noData ? undefined : '12px')};

	display: flex;
	justify-content: center;
	align-items: center;
	gap: 4px;
	cursor: pointer;
`

interface LanguageSelectorProps {
	onChange: (value: string) => any
	noData: boolean
}

export function AvailableLanguageSelector({ onChange, noData }: LanguageSelectorProps) {
	const [t] = useT()
	const theme = useTheme()
	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	return (
		<>
			<Button noData={noData} ref={setRef} onClick={() => setMenuOpened(true)}>
				<PlusIcon size={14} color={theme.colors.white} />
				{t('Add New', 'addNew')}
			</Button>
			{menuOpened && (
				<LanguageSelectorMenu
					anchorRef={ref}
					setMenuOpened={setMenuOpened}
					onChange={(val: any) => {
						onChange(val)
					}}
				/>
			)}
		</>
	)
}

interface LanguageMenuProps {
	anchorRef: HTMLDivElement | null
	setMenuOpened: Dispatch<SetStateAction<boolean>>
	onChange: (value: string) => any
}

const LanguageSelectorMenu = ({ anchorRef, setMenuOpened, onChange }: LanguageMenuProps) => {
	const [closing, setClosing] = useState(false)
	const [project] = useCurrentProject()

	const availableLanguages = project?.preferences?.availableLanguages ?? []
	const languagesArray = Object.entries(NLanguages.LANGUAGES).filter(
		([, language]) => !availableLanguages.includes(language.languageCode)
	) // filter the languages by already chosen languages

	return (
		<Menu
			searchable
			searchPlaceholder="Search For Language"
			closing={closing}
			anchorRef={anchorRef}
			placement="top"
			offset={[0, 4]}
			onClose={() => {
				setMenuOpened(false)
			}}
		>
			{languagesArray.map(([, value]) => (
				<MenuItem
					key={value.name}
					text={value.name}
					isDisabled={project?.preferences!.defaultLanguage === value.languageCode}
					onClick={() => {
						onChange(value.languageCode)
						setClosing(true)
						setMenuOpened(false)
					}}
				/>
			))}
		</Menu>
	)
}
