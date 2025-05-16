// import { darken, lighten } from 'polished'
// import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
// import { ColorResult, SketchPicker } from 'react-color'
// import styled, { useTheme } from 'styled-components'
// import { Button } from '../../../components/Button'
// import { DEFAULT_STYLE_VALUES } from '../../../components/Customizations/data'
// import { Row } from '../../../components/Flex'
// import { Show } from '../../../components/Show'
// import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
// import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
// import { ArrowDownFilled } from '../../../icons'
// import { NestedMenu } from './NestedMenu'
// import { useT } from '../../../hooks/useT'

// type Props = {
// 	onPropertyChange: OnPropertyChange
// }

// type SubMenuItems = {
// 	mainBgColor: boolean
// 	fontColor: boolean
// 	highlightColor: boolean
// 	darkModeBgColor: boolean
// 	darkModeFontColor: boolean
// 	darkModeHighlightColor: boolean
// }

// export const Colors = ({ onPropertyChange }: Props) => {
// 	const [t] = useT()
// 	const [project] = useCurrentProject()
// 	const [ref, setRef] = useState<HTMLDivElement | null>(null)
// 	const [menuOpen, setMenuOpen] = useState(false)
// 	const [subMenuOpen, setSubMenuOpen] = useState<SubMenuItems>({
// 		mainBgColor: false,
// 		fontColor: false,
// 		highlightColor: false,
// 		darkModeBgColor: false,
// 		darkModeFontColor: false,
// 		darkModeHighlightColor: false,
// 	})

// 	function filterObjectWithValues() {
// 		return Object.fromEntries(
// 			Object.entries(DEFAULT_STYLE_VALUES).filter(
// 				([, property]) => property.category === t('Colors', 'colors') && (property as any).isDerived !== true
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

// 	const filteredValues = Object.keys(filterObjectWithValues())

// 	return (
// 		<MenuButton
// 			isSelected={menuOpen}
// 			ref={setRef}
// 			onClick={() => {
// 				setAllToFalse()
// 				setMenuOpen((prev) => !prev)
// 			}}
// 		>
// 			<span>Colors</span>
// 			<Show when={menuOpen}>
// 				<NestedMenu
// 					disableOutsideClick={disableOutSideClick}
// 					minWidth={'240px'}
// 					closing={menuOpen}
// 					anchorRef={ref}
// 					placement="bottom"
// 					offset={[0, 6]}
// 					onOutsideClick={() => setMenuOpen(false)}
// 				>
// 					{filteredValues.map((key) => {
// 						const styleValue = filterObjectWithValues()[key]

// 						const serverValue = project?.colors?.[key] as string

// 						const handleColorSelection = (color: ColorResult) => {
// 							let colorStr = color.hex
// 							if (color.rgb.a !== 1) {
// 								colorStr = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
// 							}
// 							onPropertyChange('colors', key, colorStr)
// 						}

// 						return (
// 							<ParentMenu
// 								key={key}
// 								selectionKey={key}
// 								color={serverValue || styleValue.defaultValue}
// 								name={styleValue.name}
// 								onChange={handleColorSelection}
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
// 	color: string | undefined
// 	name: ReactNode
// 	onChange: (color: ColorResult) => void
// 	setMenuOpened: Dispatch<SetStateAction<boolean>>
// 	setSubMenuOpen: Dispatch<SetStateAction<SubMenuItems>>
// 	subMenuOpen: SubMenuItems
// 	onClose: () => void
// }

// const ParentMenu = ({
// 	color,
// 	name,
// 	onChange,
// 	setMenuOpened,
// 	subMenuOpen,
// 	setSubMenuOpen,
// 	onClose,
// 	selectionKey,
// }: ParentMenuProps) => {
// 	const [subRef, setSubRef] = useState<HTMLDivElement | null>(null)
// 	const theme = useTheme()

// 	const handleColorSelection = (color: ColorResult) => {
// 		onChange(color)
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
// 			<Row align="center" justify="center" gap={8}>
// 				<ColorCircle bg={color}></ColorCircle>
// 				<>{name} </>
// 			</Row>
// 			<ArrowDownFilled size={10} color={theme.colors.greyLight} />

// 			<Show when={subMenuOpen[selectionKey as keyof SubMenuItems]}>
// 				<NestedMenu
// 					anchorRef={subRef}
// 					maxHeight="350px"
// 					closing={subMenuOpen[selectionKey as keyof SubMenuItems]}
// 					placement="right"
// 					offset={[0, 6]}
// 					disableClickInside={false}
// 				>
// 					<RelativeDiv>
// 						<SketchPicker color={color} onChange={handleColorSelection} disableAlpha={true} />
// 						<StyledButton
// 							onClick={() => {
// 								onClose()
// 								setMenuOpened(false)
// 							}}
// 						>
// 							Close
// 						</StyledButton>
// 					</RelativeDiv>
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

// const ColorCircle = styled.div<{ bg?: string }>`
// 	background-color: ${({ bg }) => bg};
// 	width: 18px;
// 	height: 18px;

// 	border-radius: 8px;
// 	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
// `

// const RelativeDiv = styled.div`
// 	position: relative;
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
