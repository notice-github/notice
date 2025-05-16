import { WorkspaceModel } from '@notice-app/models'
import styled, { useTheme } from 'styled-components'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useDeleteWorkspace } from '../../hooks/api/workspace/useDeleteWorkspace'
import { Pages } from '../../pages'
import { useT } from '../../hooks/useT'

interface Props {
	workspace: WorkspaceModel.client
}

export const DeleteWorkspaceConfirmation = ({ workspace }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()
	const deleteWorkspace = useDeleteWorkspace()

	return (
		<Container>
			<Title>{t('Delete Workspace', 'deleteWorkspace')}</Title>
			<Text16>{t('Are you sure you want to delete this workspace?', 'deleteWorkspaceDescription')}</Text16>
			<br />
			<Text16>{t('This action cannot be undone.', 'deleteWorkspaceWarning')}</Text16>
			<Footer>
				<Button
					padding="8px 16px"
					color={theme.colors.white}
					textColor={theme.colors.error}
					style={{ fontWeight: 600, border: `2px solid ${theme.colors.error}` }}
					onClick={() => Modals.deleteWorkspaceConfirmation.close()}
				>
					{t('Cancel', 'cancel')}
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.error}
					style={{ fontWeight: 600 }}
					loader={deleteWorkspace.isLoading}
					onClick={async () => {
						if (deleteWorkspace.isLoading) return

						try {
							await deleteWorkspace.mutateAsync({ workspace })
							toast.success(`"${workspace.name}" workspace successfully deleted`)
							navigate(Pages.SETTINGS_MY_WORKSPACES)
						} catch (_) {}

						Modals.deleteWorkspaceConfirmation.close()
					}}
				>
					{t('Confirm', 'confirm')}
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
