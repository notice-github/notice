import styled from 'styled-components'
import { useOnPropertyChange } from '../../hooks/bms/project/useOnPropertyChange'
import { Column } from '../Flex'
import { CustomDomain } from './CustomDomain'
import { NoticeDomain } from './NoticeDomain'

interface IProps {
	closeMenu: () => void
}

export const PublishHosting = ({ closeMenu }: IProps) => {
	const [onPropertyChange] = useOnPropertyChange()

	return (
		<StyledColumn>
			<NoticeDomain onPropertyChange={onPropertyChange} />
			<CustomDomain onClick={closeMenu} />
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	padding: 16px 12px;
	margin-top: 40px;
	width: 430px;
	box-sizing: border-box;
`
