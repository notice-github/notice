import { useState } from 'react'
import { useSlate } from 'slate-react'
import styled from 'styled-components'
import { Menu } from '../Components/Menu'
import { MenuItem } from '../Components/Menu/MenuItem'
import { MenuSectionTitle } from '../Components/Menu/MenuSectionTitle'
import { Show } from '../Components/Show'
import { setLeafBgColor, setLeafColor } from '../Leaves/Color.leaf'
import { backgroundColorSelection, fontColorSelection } from '../colors'

interface ColorPickerProps extends React.ComponentPropsWithoutRef<'div'> {
	show: boolean
	setShow: (show: boolean) => void
}

interface ColorSelectionItem {
	text: string
	color: string
	name: string
	key: string
}

export const HoveringColorMenu = ({ show, setShow, onClick }: ColorPickerProps) => {
	const editor = useSlate()
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)

	const renderMenuItem = (elem: ColorSelectionItem, colorType: 'text' | 'background') => {
		return (
			<MenuItem
				text={<Color>{elem.text}</Color>}
				icon={
					<ColoredText colorSelection={elem.color} colorType={colorType}>
						A
					</ColoredText>
				}
				name={elem.name}
				onClick={(e) => {
					e.stopPropagation()
					e.preventDefault()
					colorType === 'text' ? setLeafColor(editor, elem.color) : setLeafBgColor(editor, elem.color)
					onClick?.(e)
				}}
				key={elem.key}
				subtype="MenuItem"
			/>
		)
	}
	const elems = [
		<MenuSectionTitle text="Text" name="MenuSectionText" key={'menuSectionText'} subtype="SectionTitle" />,
		...fontColorSelection.map((elem) => renderMenuItem(elem, 'text')),
		<MenuSectionTitle text="Background" name="MenuSectionBackground" key={'menuSectionBg'} subtype="SectionTitle" />,
		...backgroundColorSelection.map((elem) => renderMenuItem(elem, 'background')),
	]

	return (
		<div>
			<RefElement ref={setReferenceElement}></RefElement>
			<Show when={show}>
				<Menu
					closing={!show}
					anchorRef={referenceElement}
					offset={[0, 20]}
					onClose={() => {
						setShow(false)
					}}
					maxHeight={'360px'}
					placement="bottom"
				>
					{elems}
				</Menu>
			</Show>
		</div>
	)
}

interface IColoredText {
	colorType: string
	colorSelection: string
}

const ColoredText = styled.div<IColoredText>`
	color: ${({ colorType, colorSelection, theme }) => (colorType === 'text' ? colorSelection : theme.colors.textDark)};
	background-color: ${({ colorType, colorSelection }) => {
		return colorType === 'background' ? colorSelection : 'transparent'
	}};

	width: 22px;
	height: 22px;
	text-align: center;
	border-radius: 3px;
`

const Color = styled.div``

const RefElement = styled.div`
	width: 0px;
	height: 0px;
	background-color: transparent;
`
