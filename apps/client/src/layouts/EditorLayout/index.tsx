import { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import dayjs from 'dayjs'
import { lighten } from 'polished'
import { useSubscription } from '../../hooks/api/subscription/useSubscription'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { useCssVariableSync } from '../../hooks/bms/project/useCssVariableSync'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useProjects } from '../../hooks/bms/project/useProjects'
import { useSearchParams } from '../../hooks/useSearchParams'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface Props {
	children?: React.ReactNode
}

export const EditorLayout = ({ children }: Props) => {
	const [workspace] = useCurrentWorkspace()
	const projects = useProjects(workspace)
	const [params, setParams] = useSearchParams()
	const [currentProject] = useCurrentProject()
	const subscription = useSubscription(workspace)
	useCssVariableSync(currentProject)

	const [currentPage] = useCurrentPage()

	useEffect(() => {
		if (currentProject == null && projects.data != null && projects.data.length > 0) {
			setParams({ project: projects.data[0].id, page: projects.data[0].id })
			return
		}

		if (params['page'] == null && currentProject != null) {
			setParams({ page: currentProject.id })
			return
		}

		if (params['page'] == null && params['project'] != null) {
			setParams({ page: params['project'] })
			return
		}

		if (projects.isFetched && (projects.data == null || projects.data.length === 0)) {
			setParams({ project: null, page: null })
			return
		}
	}, [params['project'], params['page'], projects.data, currentProject, projects.isFetched, currentPage])

	const daysLeft = useMemo(
		() =>
			subscription.data?.isFreeTrial && subscription?.data?.expiresAt
				? dayjs(subscription.data.expiresAt).add(1, 'day').diff(dayjs(), 'day')
				: undefined,
		[subscription.data]
	)

	return (
		<LayoutGrid>
			<LayoutHeader>
				<Header />
			</LayoutHeader>
			<LayoutSidebar>
				<Sidebar />
			</LayoutSidebar>
			<LayoutMain id="mainLayout">
				{children}
				<Outlet />
			</LayoutMain>
		</LayoutGrid>
	)
}

const LayoutGrid = styled.div`
	display: grid;
	height: 100vh; // Maybe bad, idk, but for the moment it solve a lot of problems with the scroll
	grid-template-columns: 240px 1fr;
	grid-template-rows: auto 1fr;
	grid-template-areas:
		'sidebar header'
		'sidebar main';
`

const LayoutHeader = styled.header`
	grid-area: header;
`

const LayoutSidebar = styled.aside`
	grid-area: sidebar;
	background-color: ${({ theme }) => lighten(0.03, theme.colors.dark)};
	color: ${({ theme }) => theme.colors.textLight};
	border-right: 2px solid ${({ theme }) => theme.colors.borderLight}; // Optional
	height: 100%;
`

const LayoutMain = styled.main`
	min-height: 100%;
	grid-area: main;
	background-color: ${({ theme }) => theme.colors.backgroundLighterGrey};
	overflow: auto; // Maybe bad, idk, but for the moment it solve a lot of problems with the scroll
`
