import { useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import styled, { useTheme } from 'styled-components'
import { ColorIcon } from '../../icons/ColorIcon'
import Cross from '../../icons/Cross'
import HexIcon from '../../icons/HexIcon'
import Tick from '../../icons/Tick'
import { Menu } from '../Menu'
import { Show } from '../Show'

interface Props {
	onSelect: (color: string) => void
	currentColor: string
	defaultColor: string
}

const ColorSelector = ({ onSelect, currentColor, defaultColor }: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	const [localColor, setLocalColor] = useState<string | null>(null)

	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	const theme = useTheme()

	const handleChange = (color: ColorResult) => {
		let colorStr = color.hex
		if (color.rgb.a !== 1) {
			colorStr = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`
		}

		setLocalColor(colorStr)
	}

	const handleDisplayValue = () => {
		const value = localColor || currentColor || defaultColor
		if (!value && value === null) return 'color'
		let displayValue
		if (value?.substring(0, 1) === '#') {
			displayValue = value?.substring(1)
		} else {
			const colorArray = value?.match(/[0-9.]+/gi)

			displayValue = colorArray?.join('-')
		}

		return displayValue
	}

	return (
		<FlexRow ref={setRef}>
			<ColorSquare
				onClick={() => setIsOpen(true)}
				backgroundColor={localColor || currentColor || defaultColor}
			></ColorSquare>
			<ColorValue onClick={() => setIsOpen(true)}>
				{(localColor || currentColor || defaultColor)?.substring(0, 1) === '#' ? (
					<HexIcon size={10} />
				) : (
					<ColorIcon size={10} color={theme.colors.primary} />
				)}
				<ColorValueText>{handleDisplayValue()}</ColorValueText>
			</ColorValue>
			<Show when={isOpen}>
				<ActionButtons>
					<SelectButton
						onClick={() => {
							if (localColor !== null) {
								onSelect(localColor)
							}
							setIsOpen(false)
						}}
					>
						<Tick color={theme.colors.white} />
					</SelectButton>
					<CloseButton
						onClick={() => {
							if (currentColor) {
								setLocalColor(currentColor)
							}
							setIsOpen(false)
						}}
					>
						<Cross color={theme.colors.white} />
					</CloseButton>
				</ActionButtons>
			</Show>
			<Show when={isOpen}>
				<Menu disableOutsideClick closing={isOpen} anchorRef={ref} placement="top" offset={[0, 6]}>
					<SketchPicker
						color={localColor || currentColor || defaultColor}
						onChange={handleChange}
						disableAlpha={true}
					/>
				</Menu>
			</Show>
		</FlexRow>
	)
}

const FlexRow = styled.div`
	flex-direction: row;
	display: flex;

	align-items: center;
	justify-content: space-evenly;
`

const ColorSquare = styled.div<{ backgroundColor: string }>`
	width: 26px;
	height: 26px;
	margin-right: 8px;
	padding: 1px;
	border-radius: 4px;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	background-color: ${({ backgroundColor }) => backgroundColor};
	cursor: pointer;
`

const ColorValue = styled.div`
	height: 30px;
	background: transparent;
	flex: 2 1 0%;
	font-size: 8px;
	display: flex;
	flex-direction: center;
	align-items: center;
	gap: 8px;
	padding: 0 10px 0 5px;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 4px;
`

const ActionButtons = styled.div`
	display: flex;
	flex: 1 1 0%;
	flex-direction: row;
	margin-left: 4px;
`

const SelectButton = styled.div`
	display: flex;
	border-style: solid;
	border-radius: 4px;

	border: 0 solid ${({ theme }) => theme.colors.primary};

	flex-direction: row;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	flex: 0 0 auto;

	color: rgb(255, 255, 255);
	height: 24px;
	width: 24px;

	border-bottom-right-radius: 0px;
	border-right-width: 1px;
	border-top-right-radius: 0px;
	background-color: ${({ theme }) => theme.colors.primary};
`

const CloseButton = styled.div`
	border: 0 solid black;

	display: flex;
	flex: 0 0 auto;

	margin: 0px;
	padding: 0px;

	border-radius: 4px;

	flex-direction: row;
	justify-content: center;
	align-items: center;

	cursor: pointer;

	color: rgb(255, 255, 255);
	background-color: ${({ theme }) => theme.colors.error};

	height: 24px;
	width: 24px;

	border-bottom-left-radius: 0px;
	border-top-left-radius: 0px;
`

const ColorValueText = styled.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

export default ColorSelector
