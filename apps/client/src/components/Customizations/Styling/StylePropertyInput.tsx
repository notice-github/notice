import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { RefreshIcon } from '../../../icons'
import { isValidCSSValue } from '../../../utils/CSS'
import { SimpleInput } from '../../SimpleInput'
import Tooltip from '../../Tooltip'

interface Props {
	onPropertyChange: OnPropertyChange
	serverValue: string
	propertyName: string
	defaultValue: string
	cssPropertyName: string
}

export const StylePropertyInput = ({
	onPropertyChange,
	cssPropertyName,
	propertyName,
	serverValue,
	defaultValue,
}: Props) => {
	const theme = useTheme()
	const [localValue, setLocalValue] = useState(serverValue)

	// really weird not sure why exactly but maybe because of the rerender if the current project hook
	useEffect(() => {
		if (serverValue) {
			setLocalValue(serverValue)
		} else {
			setLocalValue(defaultValue)
		}
	}, [serverValue])

	return (
		<SimpleInput
			type="text"
			noSuffixBorder
			placeholder="Write CSS Value with units"
			onChange={(value) => setLocalValue(value)}
			onBlur={(value) => {
				if (value.trim() === serverValue) return

				if (!localValue || localValue.length === 0 || !isValidCSSValue(cssPropertyName, localValue)) {
					onPropertyChange('preferences', propertyName, defaultValue)
					setLocalValue(defaultValue)
				} else {
					onPropertyChange('preferences', propertyName, value)
				}
			}}
			value={localValue}
			suffix={
				<Tooltip placement="top" offset={[0, 6]} content="Revert to default">
					<FlexContainer onClick={() => onPropertyChange('preferences', propertyName, defaultValue)}>
						<RefreshIcon size={18} color={theme.colors.greyLight} />
					</FlexContainer>
				</Tooltip>
			}
		/>
	)
}

const FlexContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding-right: 4px;
	cursor: pointer;
	box-sizing: border-box;
	&:hover {
		path {
			stroke: ${({ theme }) => theme.colors.primary};
		}
	}
`
