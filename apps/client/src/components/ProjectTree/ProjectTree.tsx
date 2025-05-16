import { BlockModel } from '@notice-app/models'
import { useState } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { darken, lighten } from 'polished'
import { EmojiMenu } from '../../containers/Menus/EmojiMenu'
import { ProjectMenu } from '../../containers/Menus/ProjectMenu'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../hooks/api/useUser'
import { useCreatePage } from '../../hooks/bms/page/useCreatePage'
import { usePagesGraph } from '../../hooks/bms/page/usePages'
import { useReorderPage } from '../../hooks/bms/page/useReorderPage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useUpdateProject } from '../../hooks/bms/project/useUpdateProject'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useSearchParams } from '../../hooks/useSearchParams'
import { PlusIcon } from '../../icons'
import { HorizontalDotsIcon } from '../../icons/HorizontalDotsIcon'
import { renderIcon } from '../../utils/icon'
import { EditableTitle } from '../EditableTitle'
import { Spacer } from '../Flex'
import { PagesList } from './PagesList'
import { LockIcon } from '../../icons/LockIcon'
import { TrashIcon } from '../../icons/TrashIcon'
import { Modals } from '../Modal'

export type ProjectTreeThemeType = 'light' | 'dark'

interface Props {
	project: BlockModel.block
	readOnly?: boolean
	theme?: ProjectTreeThemeType
	projectIsDragged?: boolean
	isLocked?: boolean
}

export const ProjectTree = ({ project, readOnly = false, isLocked = false, theme = 'dark' }: Props) => {
	const styledTheme = useTheme()
	const reorderPage = useReorderPage()

	const [workspace] = useCurrentWorkspace()
	const [currentProject, setCurrentProject] = useCurrentProject()
	const updateProject = useUpdateProject()
	const createPage = useCreatePage()

	const [pageId] = useSearchParam('page')
	const [, setParams] = useSearchParams()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	const [emojiOpened, setEmojiOpened] = useState(false)
	const [emojiRef, setEmojiRef] = useState<HTMLDivElement | null>(null)

	const [titleEditable, setTitleEditable] = useState(false)

	// Dnd
	const [isDragged, setIsDragged] = useState(false)

	const trackEvent = useTrackEvent()
	const user = useUser()

	const active = project.id === currentProject?.id
	const selected = project.id === pageId
	const title = project?.preferences?.projectTitle ?? project?.data?.text

	async function onDrop(event: React.DragEvent<HTMLDivElement>) {
		if (isLocked) return

		try {
			const droppedPage = JSON.parse(event.dataTransfer.getData('droppedPage'))
			if (droppedPage.page.rootId !== project.id) {
				console.log('We do not allow to drop pages from other projects at the moment.')
				return
			}

			await reorderPage.mutateAsync({
				page: droppedPage.page,
				newParent: project,
				oldParent: droppedPage.parent,
			})
		} catch (e) {
			console.error(e)
		}
		setIsDragged(false)
	}

	return (
		<Gaper>
			<Container
				onClick={(e) => {
					if (isLocked || ref?.contains(e.target as Node) || emojiRef?.contains(e.target as Node)) return
					setCurrentProject(project)
				}}
				treeTheme={theme}
				selected={selected}
				onDragOver={(event) => {
					if (isLocked) return
					setIsDragged(true)
					event.preventDefault()
				}}
				onDragLeave={(event) => {
					if (isLocked) return
					setIsDragged(false)
					event.preventDefault()
				}}
				onDrop={onDrop}
				onDragEnter={(event) => event.preventDefault()}
				// TODO: when we implement DnD on other projects, you can remove !active
				isDragged={isDragged && active}
				locked={isLocked}
			>
				<ContentWrapper>
					<IconWrapper
						ref={setEmojiRef}
						active={emojiOpened}
						onClick={(e) => {
							if (readOnly || isLocked) return
							setEmojiOpened(true)
						}}
						readOnly={readOnly || isLocked}
					>
						<RenderIconWrapper locked={isLocked}>{renderIcon(project?.metadata?.icon)}</RenderIconWrapper>
						{isLocked && (
							<LockIconWrapper>
								<LockIcon color={styledTheme.colors.error} size={18} />
							</LockIconWrapper>
						)}
					</IconWrapper>
					<StyledEditableTitle
						value={title ?? 'Untitled'}
						editable={titleEditable}
						onChange={async (value) => {
							setTitleEditable(false)
							await updateProject.mutateAsync({ project, workspace, preferences: { projectTitle: value } })
						}}
						treeTheme={theme}
						selected={selected}
						locked={isLocked}
					/>
				</ContentWrapper>
				<Spacer />
				{!readOnly && !isLocked && (
					<OptionsWrapper>
						<Options
							ref={setRef}
							active={menuOpened}
							visible={menuOpened}
							onClick={(e) => {
								setMenuOpened(true)
							}}
						>
							<HorizontalDotsIcon size={14} color={styledTheme.colors.grey} />
						</Options>
						<Options
							isPlus={true}
							active={false}
							visible={menuOpened}
							onClick={async (e) => {
								e.stopPropagation()

								if (createPage.isLoading) return
								const page = await createPage.mutateAsync({ name: '', parent: project })
								trackEvent.mutate({ id: user.email, eventName: 'New Page', data: { origin: 'Page List' } })
								setParams({ project: project.id, page: page.id }, { replace: false })
							}}
						>
							<PlusIcon size={14} color={styledTheme.colors.white} />
						</Options>
					</OptionsWrapper>
				)}
				{!readOnly && isLocked && (
					<OptionsWrapper>
						<Options
							ref={setRef}
							active={menuOpened}
							visible={menuOpened}
							onClick={(e) => {
								setMenuOpened(true)
							}}
						>
							<HorizontalDotsIcon size={14} color={styledTheme.colors.grey} />
						</Options>
						<Options
							isDestructive={true}
							active={false}
							visible={menuOpened}
							onClick={async (e) => {
								e.stopPropagation()
								Modals.deleteProjectConfirmation.open({ project })
							}}
						>
							<TrashIcon size={14} color={styledTheme.colors.white} />
						</Options>
					</OptionsWrapper>
				)}
			</Container>
			{active && <PagesListWrapper project={project} theme={theme} readOnly={readOnly} projectIsDragged={isDragged} />}
			{menuOpened && (
				<ProjectMenu
					project={project}
					anchorRef={ref}
					limited={isLocked}
					onClose={() => setMenuOpened(false)}
					onRename={() => setTitleEditable(true)}
				/>
			)}
			{emojiOpened && (
				<EmojiMenu
					anchorRef={emojiRef}
					onClose={() => setEmojiOpened(false)}
					onSelect={(emoji) => updateProject.mutate({ project, workspace, metadata: { icon: emoji } })}
				/>
			)}
		</Gaper>
	)
}

const PagesListWrapper = ({
	project,
	readOnly = false,
	theme,
	projectIsDragged,
}: Pick<Props, 'project' | 'readOnly' | 'theme' | 'projectIsDragged'>) => {
	const page = usePagesGraph(project.id)

	if (page.data == null) return <></>

	return <PagesList theme={theme} page={page.data} depth={0} readOnly={readOnly} projectIsDragged={projectIsDragged} />
}

const Gaper = styled.div`
	margin-bottom: 8px;
`

const Options = styled.div<{ active: boolean; visible: boolean; isPlus?: boolean; isDestructive?: boolean }>`
	align-items: center;
	justify-content: center;
	padding: 4px;
	cursor: pointer;
	border-radius: ${({ theme }) => theme.borderRadius};
	display: ${({ visible }) => (visible ? 'flex' : 'none')};
	background-color: ${({ theme, active, isPlus, isDestructive }) => {
		if (isPlus) return theme.colors.primary
		if (isDestructive) return theme.colors.error
		if (active) return theme.colors.activeDark
		return undefined
	}};

	&:hover {
		background-color: ${({ theme, isPlus, isDestructive }) => {
			if (isPlus) return theme.colors.primaryDark
			if (isDestructive) return darken(0.25, theme.colors.error)
			return theme.colors.activeDark
		}};
	}
`

const StyledEditableTitle = styled(EditableTitle)<{
	selected: boolean
	treeTheme?: ProjectTreeThemeType
	locked?: boolean
}>`
	color: ${({ theme, selected, treeTheme }) =>
		selected && treeTheme === 'light'
			? theme.colors.primary
			: treeTheme === 'light'
			? lighten(0.03, theme.colors.dark)
			: theme.colors.white} !important;
	filter: ${({ locked }) => (locked ? 'blur(3px)' : undefined)};
	cursor: ${({ locked }) => (locked ? 'default' : undefined)};
`

const RenderIconWrapper = styled.div<{ locked?: boolean }>`
	display: ${({ locked }) => (locked ? 'none' : 'inherit')};
`
const LockIconWrapper = styled.div``

const Container = styled.div<{
	selected: boolean
	treeTheme?: ProjectTreeThemeType
	isDragged: boolean
	locked?: boolean
}>`
	display: flex;
	align-items: center;
	height: 28px;
	padding: 4px 10px 4px 14px;
	background-color: ${({ theme, selected, treeTheme }) =>
		selected ? (treeTheme === 'light' ? theme.colors.primaryExtraLight : theme.colors.activeDark) : undefined};

	border-bottom: 2px solid ${({ theme, isDragged }) => (isDragged ? theme.colors.primary : 'transparent')};
	cursor: ${({ locked }) => (locked ? 'default' : 'pointer')};
	user-select: ${({ locked }) => (locked ? 'none' : 'auto')};
	transition: 0.2s all ease;

	&:hover {
		background-color: ${({ theme, selected, treeTheme }) =>
			selected ? undefined : treeTheme === 'light' ? theme.colors.primaryExtraLight : theme.colors.hoverDark};
	}

	&:hover ${Options} {
		display: flex;
	}

	&:hover ${StyledEditableTitle} {
		filter: inherit !important;
	}

	&:hover ${RenderIconWrapper} {
		display: inherit;
	}

	&:hover ${LockIconWrapper} {
		display: none;
	}
`

const ContentWrapper = styled.div`
	display: flex;
	align-items: center;
	overflow: hidden;
`

const IconWrapper = styled.div<{ active: boolean; readOnly: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 3px;
	margin-right: 4px;
	font-size: 14px;
	border-radius: 3px;
	background-color: ${({ theme, active }) => (active ? theme.colors.activeDark : undefined)};

	${({ readOnly }) => {
		if (!readOnly)
			return css`
				&:hover {
					background-color: ${({ theme }) => theme.colors.activeDark};
				}
			`
	}}
`

const OptionsWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 2px;
	margin-left: 4px;
`
