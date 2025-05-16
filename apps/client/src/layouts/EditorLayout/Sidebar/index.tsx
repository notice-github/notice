import { useState } from 'react'
import styled from 'styled-components'

import { Column, Spacer } from '../../../components/Flex'
import { Loader } from '../../../components/Loader'
import { ProjectTree } from '../../../components/ProjectTree/ProjectTree'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useProjects } from '../../../hooks/bms/project/useProjects'
import { useT } from '../../../hooks/useT'
import { Footer } from './Footer'
import { Message } from './Message'
import { WorkspaceSelector } from './Workspaces/WorkspaceSelector'

export const Sidebar = () => {
	const [t] = useT()
	const [workspace] = useCurrentWorkspace()
	const projects = useProjects(workspace)
	const [border, setBorder] = useState(false)

	return (
		<Container>
			<WorkspaceSelector />
			<List
				border={border}
				onScroll={(e) => {
					const posY = e.currentTarget.scrollTop
					if (posY === 0 && border === true) setBorder(false)
					else if (posY > 0 && border === false) setBorder(true)
				}}
			>
				{projects.data?.map((project) => (
					<ProjectTree key={project.id} project={project} />
				))}
				{!projects.isFetched && (
					<LoaderWrapper>
						<Loader />
					</LoaderWrapper>
				)}
				{/* <NewProjectButton /> */}
			</List>
			<Spacer />
			<Message />
			<Separator />
			<Footer />
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
`

const List = styled(Column)<{ border: boolean }>`
	position: relative;
	overflow-y: auto;
	border-top: ${({ theme, border }) => (border ? `1px solid ${theme.colors.borderDark}` : undefined)};
`

const Separator = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${({ theme }) => theme.colors.borderDark};
`

const LoaderWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8px 0px;
`
