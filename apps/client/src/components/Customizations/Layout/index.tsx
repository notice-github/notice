import styled from 'styled-components'
import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { Column } from '../../Flex'
import { CustomLayoutOptions } from './CustomLayoutOptions'

export const CustomizationLayout = () => {
	const [onPropertyChange] = useOnPropertyChange()

	return (
		<FlexColumn>
			<Column>
				<CustomLayoutOptions onPropertyChange={onPropertyChange} />
			</Column>
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	padding: 24px;
	box-sizing: border-box;
	height: calc(100vh - ${({ theme }) => theme.modalMargin} - 85px * 2);
	overflow: auto;
`
