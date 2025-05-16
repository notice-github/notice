import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Modals } from '../../components/Modal'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SimpleInput } from '../../components/SimpleInput'
import { useCreateWorkspace } from '../../hooks/api/workspace/useCreateWorkspace'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useT } from '../../hooks/useT'

export const CreateWorkspace = () => {
	const [t] = useT()
	const createWorkspace = useCreateWorkspace()
	const [_, setWorkspaceId] = useSearchParam('workspace')

	const [name, setName] = useState('')

	const onCreate = useCallback(async () => {
		if (createWorkspace.isLoading) return

		const workspace = await createWorkspace.mutateAsync({ name })
		setWorkspaceId(workspace.id)

		Modals.createWorkspace.close()
	}, [name, createWorkspace.isLoading])

	return (
		<Container>
			<Title>{t('Create a new workspace', 'createANewWorkspace')}</Title>
			<Hint>{t('Enter the name of your new workspace', 'enterNameOfNewWorkspace')}</Hint>
			<SimpleInput value={name} onChange={(value) => setName(value)} placeholder="Workspace name" />
			<ButtonGroup>
				<SettingButton onClick={() => Modals.createWorkspace.close()}>{t('Cancel', 'cancel')}</SettingButton>
				<SettingButton onClick={onCreate} loader={createWorkspace.isLoading} disabled={name.trim() === ''} primary>
					{t('Create', 'create')}
				</SettingButton>
			</ButtonGroup>
		</Container>
	)
}

const Container = styled.div`
	min-width: 350px;
	padding: 24px;
	user-select: none;
`

const Title = styled.h1`
	font-style: normal;
	font-weight: 700;
	font-size: 26px;
	margin-bottom: 24px;
`

const Hint = styled.p`
	margin-bottom: 8px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
	gap: 8px;
`
