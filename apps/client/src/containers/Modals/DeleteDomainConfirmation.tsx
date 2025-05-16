import { BlockModel } from '@notice-app/models'
import styled, { useTheme } from 'styled-components'

import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useDomainDelete } from '../../hooks/bms/domain/useDomainDelete'

interface Props {
	project: BlockModel.block
}

export const DeleteDomainConfirmation = ({ project }: Props) => {
	const theme = useTheme()

	const deleteDomain = useDomainDelete()

	return (
		<Container>
			<Title>Unlink Domain</Title>
			<Text16>This action will unlink the custom domain from the project, are you sure you want to continue?</Text16>
			<Footer>
				<Button
					padding="8px 16px"
					color={theme.colors.white}
					textColor={theme.colors.error}
					style={{ fontWeight: 600, border: `2px solid ${theme.colors.error}` }}
					onClick={() => Modals.deleteDomainConfirmation.close()}
				>
					Cancel
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.error}
					style={{ fontWeight: 600 }}
					loader={deleteDomain.isLoading}
					onClick={async () => {
						if (deleteDomain.isLoading) return
						await deleteDomain.mutateAsync({ block: project })

						window.location.reload()

						// Modals.deleteDomainConfirmation.close()
					}}
				>
					Confirm
				</Button>
			</Footer>
		</Container>
	)
}

const Container = styled.div`
	width: 427px;
	padding: 32px;
`

const Title = styled.h1`
	font-size: 20px;
	margin-bottom: 24px;
`

const Text16 = styled.p`
	font-size: 16px;
	line-height: 22.4px;
`

const Footer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: end;
	gap: 16px;
	margin-top: 30px;
`
