import styled from 'styled-components'
import { optionsFormattedFonts } from '../../../data/fonts'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import ColorSelector from '../../Selectors/ColorSelector'
import { FontSelector } from '../../Selectors/FontSelector'
import { StylePropertyInput } from './StylePropertyInput'

interface Props {
	type: string
	propertyName: string
	cssPropertyName: string
	onPropertyChange: OnPropertyChange
	serverValue: string
	defaultValue: string
}

export const StylingValueSelector = ({
	type,
	propertyName,
	onPropertyChange,
	cssPropertyName,
	serverValue,
	defaultValue,
}: Props) => {
	switch (type) {
		case 'color-selector':
			return (
				<ColorSelector
					defaultColor={defaultValue}
					onSelect={(color) => onPropertyChange('colors', propertyName, color)}
					currentColor={serverValue}
				/>
			)
		case 'font-selector':
			return (
				<FontSelector
					defaultValue={defaultValue}
					values={optionsFormattedFonts}
					onUpdate={(value) => onPropertyChange('preferences', propertyName, value)}
					currentValue={serverValue}
					displayName={(value) => value}
				/>
			)

		default:
			return (
				<StylePropertyInput
					defaultValue={defaultValue}
					onPropertyChange={onPropertyChange}
					propertyName={propertyName}
					serverValue={serverValue}
					cssPropertyName={cssPropertyName}
				/>
			)
	}
}

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	gap: 4px;
	align-items: center;
	justify-content: center;
	flex: 1 1 0;
`
