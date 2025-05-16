import styled from 'styled-components'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { BlogIcon } from '../../../icons/BlogIcon'
import Tick from '../../../icons/Tick'
import { Column } from '../../Flex'

interface Props {
	onPropertyChange: OnPropertyChange
	selectedType: boolean
}

export const PreDefinedLayoutCard = ({ onPropertyChange, selectedType }: Props) => {
	return (
		<StyledColumn>
			<FlexColumn>
				<BlogIcon size={100} />
				<Title># Blog 01</Title>{' '}
			</FlexColumn>
			<SelectionCircle>
				<Tick color="white" size={10} />
			</SelectionCircle>
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	display: flex;
	flex-direction: column;
	height: fit-content;
	justify-content: center;
	align-items: center;
	max-width: 180px;
	gap: 8px;

	cursor: pointer;
`

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	height: fit-content;
	justify-content: center;
	align-items: center;
	gap: 8px;

	padding: 12px;
	background-color: ${({ theme }) => theme.colors.white};
	border-radius: ${({ theme }) => theme.borderRadius};
	box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
	/* rgba(50, 50, 105, 0.15) 0px 2px 5px 0px,
		rgba(0, 0, 0, 0.05) 0px 1px 1px 0px; */
`

const Title = styled.h5`
	color: ${({ theme }) => theme.colors.greyDark};
`
const SelectionCircle = styled.div`
	width: 15px;
	height: 15px;
	display: flex;
	justify-content: center;
	align-items: center;

	border-radius: 50%;
	border: 2px solid ${({ theme }) => theme.colors.primary};
	background-color: ${({ theme }) => theme.colors.primary};
`
