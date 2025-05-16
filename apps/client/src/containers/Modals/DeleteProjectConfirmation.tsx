import { BlockModel, PageModel } from '@notice-app/models'
import styled, { useTheme } from 'styled-components'

import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useDeleteProject } from '../../hooks/bms/project/useDeleteProject'
import { useT } from '../../hooks/useT'

interface Props {
	project: BlockModel.block
}

export const DeleteProjectConfirmation = ({ project }: Props) => {
	const theme = useTheme()
	const [t] = useT()

	const [workspace] = useCurrentWorkspace()
	const deleteProject = useDeleteProject()

	return (
		<Container>
			<Title>{t('Delete Project', 'deleteProjectDeleteProject')}</Title>
			<Text16>{t('Are you sure you want to delete this project?', 'deleteProjectAreYouSure')}</Text16>
			<br />
			<Text16>{t('This action cannot be undone.', 'deleteWarning')}</Text16>
			<Footer>
				<Button
					padding="8px 16px"
					color={theme.colors.white}
					textColor={theme.colors.error}
					style={{ fontWeight: 600, border: `2px solid ${theme.colors.error}` }}
					onClick={() => Modals.deleteProjectConfirmation.close()}
				>
					{t('Cancel', 'cancelButton')}
				</Button>
				<Button
					padding="8px 16px"
					color={theme.colors.error}
					style={{ fontWeight: 600 }}
					loader={deleteProject.isLoading}
					onClick={async () => {
						if (deleteProject.isLoading) return
						await deleteProject.mutateAsync({ project, workspace })
						Modals.deleteProjectConfirmation.close()
					}}
				>
					{t('Confirm', 'confirmButton')}
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
