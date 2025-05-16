import { WorkspaceModel } from '@notice-app/models'
import styled, { useTheme } from 'styled-components'

import { NStrings } from '@notice-app/utils'
import { useMemo } from 'react'
import { Column, Spacer } from '../../../../components/Flex'
import { useCurrentWorkspace } from '../../../../hooks/api/useCurrentWorkspace'
import { DoneIcon } from '../../../../icons/DoneIcon'
import { WorkspaceLogo } from './WorkspaceLogo'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	workspace: WorkspaceModel.client
}

export const WorkspaceCard = ({ workspace, ...props }: Props) => {
	const theme = useTheme()
	const [currentWorkspace] = useCurrentWorkspace()

	const planName = useMemo(() => {
		const name = NStrings.capitalizeWords(workspace.subscription)
		return name.at(-1) === 's' ? name.slice(0, -1) : name
	}, [workspace.subscription])

	return (
		<Container {...props}>
			<WorkspaceLogo workspace={workspace} size={28} />
			<Infos>
				<Name>{workspace.name}</Name>
				<PlanAndMembers>{`${planName} plan`}</PlanAndMembers>
			</Infos>
			<Spacer />
			<CurrentIndicator active={currentWorkspace.id === workspace.id}>
				<DoneIcon color={theme.colors.greyDark} size={20} />
			</CurrentIndicator>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	margin: 6px 0;

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
`

const Infos = styled(Column)`
	overflow: hidden;
`

const Name = styled.h3`
	font-size: 14px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`

const PlanAndMembers = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.greyDark};
`

const CurrentIndicator = styled.div<{ active: boolean }>`
	margin-left: 8px;
	opacity: ${({ active }) => (active ? 1 : 0)};
`
