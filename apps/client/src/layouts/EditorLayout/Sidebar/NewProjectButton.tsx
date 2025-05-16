import styled, { useTheme } from 'styled-components'

import { Row } from '../../../components/Flex'
import { Modals } from '../../../components/Modal'
import { PlusIcon } from '../../../icons'

export const NewProjectButton = () => {
	const theme = useTheme()

	return (
		<Container gap={12} align="center" onClick={() => Modals.projectSelector.open()}>
			<IconWrapper>
				<PlusIcon size={16} color={theme.colors.grey} />
			</IconWrapper>
			<Text>New Project</Text>
		</Container>
	)
}

const Container = styled(Row)`
	height: 24px;
	padding: 4px 24px;
	margin: 4px 0px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.colors.hoverDark};
	}
`

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const Text = styled.span`
	color: ${({ theme }) => theme.colors.grey}
`
