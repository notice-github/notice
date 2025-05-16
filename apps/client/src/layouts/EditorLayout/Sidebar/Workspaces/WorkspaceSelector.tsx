import { NStrings } from '@notice-app/utils'
import { useMemo, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Column, Row, Spacer } from '../../../../components/Flex'
import { Show } from '../../../../components/Show'
import { WorkspacesMenu } from '../../../../containers/Menus/WorkspacesMenu'
import { useCurrentWorkspace } from '../../../../hooks/api/useCurrentWorkspace'
import { DropdownIcon } from '../../../../icons/DropdownIcon'
import { WorkspaceLogo } from './WorkspaceLogo'

export const WorkspaceSelector = () => {
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	const planName = useMemo(() => {
		const name = NStrings.capitalizeWords(workspace.subscription)
		return name.at(-1) === 's' ? name.slice(0, -1) : name
	}, [workspace.subscription])

	return (
		<>
			<Container ref={setRef} gap={8} align="center" onClick={() => setMenuOpened(true)}>
				<WorkspaceLogo workspace={workspace} size={28} />
				<Infos>
					<WorkspaceName>{workspace.name}</WorkspaceName>
					<PlanAndMembers>{`${planName} plan`}</PlanAndMembers>
				</Infos>
				<Spacer />
				<WorkspaceSuffix>
					<DropdownIcon size={16} color={theme.colors.grey} />
				</WorkspaceSuffix>
			</Container>
			<Show when={menuOpened}>
				<WorkspacesMenu anchorRef={ref} onClose={() => setMenuOpened(false)} />
			</Show>
		</>
	)
}

const Container = styled(Row)`
	height: 38px;

	padding: 4px 12px;
	margin: 4px 0;

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.hoverDark};
	}
`

const Infos = styled(Column)`
	overflow: hidden;
`

const WorkspaceName = styled.span`
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
`

const WorkspaceSuffix = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

const PlanAndMembers = styled.p`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.greyDark};
`
