// import { darken, lighten } from 'polished'
// import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
// import styled, { useTheme } from 'styled-components'
// import { Button } from '../../../components/Button'
// import { StylePropertyInput } from '../../../components/Customizations/Styling/StylePropertyInput'
// import { DEFAULT_STYLE_VALUES } from '../../../components/Customizations/data'
// import { Row } from '../../../components/Flex'
// import { Show } from '../../../components/Show'
// import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
// import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
// import { ArrowDownFilled } from '../../../icons'
// import { NestedMenu } from './NestedMenu'

// type Props = {
// 	onPropertyChange: OnPropertyChange
// }

// type SubMenuItems = {
// 	textLetterSpacing: boolean
// 	pLineHeight: boolean
// }

// export const Text = ({ onPropertyChange }: Props) => {
// 	const [project] = useCurrentProject()
// 	const [ref, setRef] = useState<HTMLDivElement | null>(null)
// 	const [menuOpen, setMenuOpen] = useState(false)
// 	const [subMenuOpen, setSubMenuOpen] = useState<SubMenuItems>({
// 		pLineHeight: false,
// 		textLetterSpacing: false,
// 	})

// 	function filterObjectWithValues() {
// 		return Object.fromEntries(
// 			Object.entries(DEFAULT_STYLE_VALUES).filter(
// 				([, property]) => property.category === 'Text' && (property as any).isDerived !== true
// 			)
// 		)
// 	}

// 	const setAllToFalse = () => {
// 		const newValues: any = {}
// 		for (const key in subMenuOpen) {
// 			newValues[key as keyof SubMenuItems] = false
// 		}
// 		setSubMenuOpen(newValues)
// 	}

// 	const disableOutSideClick = Object.values(subMenuOpen).some((val) => val === true)

// 	return (
// 		<MenuButton
// 			isSelected={menuOpen}
// 			ref={setRef}
// 			onClick={() => {
// 				setAllToFalse()
// 				setMenuOpen((prev) => !prev)
// 			}}
// 		>
// 			<span>Text</span>
// 			<Show when={menuOpen}>
// 				<NestedMenu
// 					disableOutsideClick={disableOutSideClick}
// 					minWidth={'200px'}
// 					closing={menuOpen}
// 					anchorRef={ref}
// 					placement="bottom"
// 					offset={[0, 6]}
// 					onOutsideClick={() => setMenuOpen(false)}
// 				>
// 					{Object.keys(filterObjectWithValues()).map((key) => {
// 						const styleValue = filterObjectWithValues()[key]

// 						const serverValue = project?.preferences?.[key] as string

// 						return (
// 							<ParentMenu
// 								key={key}
// 								selectionKey={key}
// 								values={{ serverValue: serverValue, defaultValue: styleValue.defaultValue }}
// 								name={styleValue.name}
// 								onChange={onPropertyChange}
// 								setSubMenuOpen={setSubMenuOpen}
// 								subMenuOpen={subMenuOpen}
// 								setMenuOpened={setMenuOpen}
// 								onClose={() => {
// 									setAllToFalse()
// 								}}
// 							></ParentMenu>
// 						)
// 					})}
// 				</NestedMenu>
// 			</Show>
// 		</MenuButton>
// 	)
// }

// type ParentMenuProps = {
// 	selectionKey: string
// 	values: Record<string, string>
// 	name: ReactNode
// 	onChange: OnPropertyChange
// 	setMenuOpened: Dispatch<SetStateAction<boolean>>
// 	setSubMenuOpen: Dispatch<SetStateAction<SubMenuItems>>
// 	subMenuOpen: SubMenuItems
// 	onClose: () => void
// }

// const ParentMenu = ({
// 	name,
// 	onChange,
// 	setMenuOpened,
// 	subMenuOpen,
// 	setSubMenuOpen,
// 	onClose,
// 	values,
// 	selectionKey,
// }: ParentMenuProps) => {
// 	const [subRef, setSubRef] = useState<HTMLDivElement | null>(null)
// 	const theme = useTheme()

// 	const getHeading = (type: string) => {
// 		switch (type) {
// 			case 'textLetterSpacing':
// 				return 'Set Space between each letter in the paragraph'
// 			case 'pLineHeight':
// 				return 'Set line height between each line in the paragraph'
// 		}
// 	}

// 	return (
// 		<StyledRow
// 			ref={setSubRef}
// 			onClick={() => {
// 				onClose()
// 				setSubMenuOpen((prev: any) => ({ ...prev, [selectionKey]: true }))
// 			}}
// 			gap={18}
// 			justify="space-between"
// 			align="center"
// 			isSelected={subMenuOpen[selectionKey as keyof SubMenuItems]}
// 		>
// 			<>{name} </>
// 			<ArrowDownFilled size={10} color={theme.colors.greyLight} />

// 			<Show when={subMenuOpen[selectionKey as keyof SubMenuItems]}>
// 				<NestedMenu
// 					anchorRef={subRef}
// 					maxHeight="350px"
// 					maxWidth="235px"
// 					closing={subMenuOpen[selectionKey as keyof SubMenuItems]}
// 					placement="right"
// 					offset={[0, 6]}
// 					disableClickInside={false}
// 				>
// 					<Padded>
// 						<Title>{getHeading(selectionKey)}</Title>
// 						<StylePropertyInput
// 							onPropertyChange={onChange}
// 							serverValue={values.serverValue}
// 							propertyName={selectionKey}
// 							defaultValue={values.defaultValue}
// 						/>
// 						<StyledButton
// 							onClick={() => {
// 								onClose()
// 								setMenuOpened(false)
// 							}}
// 						>
// 							Close
// 						</StyledButton>
// 					</Padded>
// 				</NestedMenu>
// 			</Show>
// 		</StyledRow>
// 	)
// }

// const MenuButton = styled.div<{ isSelected: boolean }>`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	color: ${({ theme }) => theme.colors.textGrey};
// 	border-radius: 4px;

// 	cursor: pointer;
// 	padding: 4px 12px;
// 	transition: all 0.2s;
// 	user-select: none;
// 	background-color: ${({ isSelected }) => (isSelected ? darken(0.08, '#EDF2FA') : 'transparent')};

// 	&:hover {
// 		background-color: ${({ theme }) => darken(0.08, '#EDF2FA')};
// 	}
// `

// const StyledRow = styled(Row)<{ isSelected: boolean }>`
// 	width: 100%;
// 	padding: 12px;
// 	box-sizing: border-box;
// 	cursor: pointer;
// 	background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.hover : 'transparent')};

// 	&:hover {
// 		background-color: ${({ theme }) => theme.colors.hover};
// 	}

// 	svg {
// 		transform: rotate(-90deg);
// 	}
// `

// const StyledButton = styled(Button)`
// 	background-color: ${({ theme }) => lighten(0.4, theme.colors.error)};
// 	color: ${({ theme }) => theme.colors.error};
// 	width: 100%;
// 	padding: 6px 8px;

// 	&:hover {
// 		background-color: ${({ theme }) => lighten(0.4, theme.colors.error)};
// 	}
// `
// const Padded = styled.div`
// 	padding: 12px;

// 	display: flex;
// 	flex-direction: column;
// 	align-items: flex-start;
// 	justify-content: center;
// 	gap: 6px;
// `

// const Title = styled.div`
// 	font-size: 12px;
// 	font-weight: bold;

// 	color: ${({ theme }) => theme.colors.greyDark};
// `
