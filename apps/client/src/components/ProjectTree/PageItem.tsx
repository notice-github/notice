import { PageModel } from '@notice-app/models'
import { useEffect, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { lighten } from 'polished'
import { EmojiMenu } from '../../containers/Menus/EmojiMenu'
import { PageMenu } from '../../containers/Menus/PageMenu'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useUser } from '../../hooks/api/useUser'
import { useCreatePage } from '../../hooks/bms/page/useCreatePage'
import { usePageBlock } from '../../hooks/bms/page/usePages'
import { useReorderPage } from '../../hooks/bms/page/useReorderPage'
import { useUpdatePage } from '../../hooks/bms/page/useUpdatePage'
import { useSearchParam } from '../../hooks/useSearchParam'
import { PlusIcon } from '../../icons'
import { ChevronIcon } from '../../icons/ChevronIcon'
import { HorizontalDotsIcon } from '../../icons/HorizontalDotsIcon'
import { renderIcon } from '../../utils/icon'
import { EditableTitle } from '../EditableTitle'
import { Spacer } from '../Flex'
import { PagesList } from './PagesList'
import { ProjectTreeThemeType } from './ProjectTree'

interface Props {
	page: PageModel.graph
	active: boolean
	depth: number
	readOnly?: boolean
	theme?: ProjectTreeThemeType
	id: string
	projectIsDragged?: boolean
	parent?: PageModel.graph
	parentIsDragging?: boolean
}

export const PageItem = ({ page, active, depth, readOnly, theme, id, parent, parentIsDragging }: Props) => {
	const styledTheme = useTheme()

	const block = usePageBlock(page)

	const updatePage = useUpdatePage()
	const reorderPage = useReorderPage()
	const createPage = useCreatePage()
	const [pageId, setPageId] = useSearchParam('page')

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	const [emojiOpened, setEmojiOpened] = useState(false)
	const [emojiRef, setEmojiRef] = useState<HTMLDivElement | null>(null)
	const [isDraggedOver, setisDraggedOver] = useState(false)
	const [isBeingDragged, setIsBeingDragged] = useState(false)

	const [expanded, setExpanded] = useState(false)
	const [titleEditable, setTitleEditable] = useState(false)

	const user = useUser()

	const selected = page.id === pageId
	const hasSubpages = page.subpages.length > 0

	useEffect(() => {
		if (active && !expanded) setExpanded(true)
	}, [active])

	function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
		setisDraggedOver(false)
		event.preventDefault()
	}

	async function onDrop(event: React.DragEvent<HTMLDivElement>) {
		// Prevent drop on itself and on its children
		if (isBeingDragged || parentIsDragging) return
		try {
			const targetDropId = id
			const droppedPage = JSON.parse(event.dataTransfer.getData('droppedPage'))
			const newParent = expanded ? page : parent ?? page
			await reorderPage.mutateAsync({
				page: droppedPage.page,
				newNeighborId: expanded ? undefined : targetDropId,
				newParent,
				oldParent: droppedPage.parent,
			})
		} catch (e) {
			console.error(e)
		}
		setisDraggedOver(false)
	}

	return (
		<div id={`page-${id}`}>
			<Container
				depth={depth}
				onClick={(e) => {
					if (ref?.contains(e.target as Node) || emojiRef?.contains(e.target as Node)) return
					setPageId(page.id, { replace: false })
					if (!expanded) setExpanded(true)
				}}
				selected={selected}
				treeTheme={theme}
				isDraggedOver={isDraggedOver && !isBeingDragged && !parentIsDragging}
				onDragOver={(event) => {
					setisDraggedOver(true)
					event.preventDefault()
				}}
				onDragStart={(event) => {
					setIsBeingDragged(true)
					event.dataTransfer.setData('droppedPage', JSON.stringify({ page, parent }))
				}}
				onDragLeave={onDragLeave}
				draggable={true}
				onDragEnter={(event) => event.preventDefault()}
				onDrop={onDrop}
				onDragEnd={(event) => {
					setIsBeingDragged(false)
					// onDragLeave(event)
				}}
			>
				<ContentWrapper>
					<Expander
						expanded={expanded}
						onClick={(e) => {
							e.stopPropagation()
							setExpanded(!expanded)
						}}
					>
						{hasSubpages && <ChevronIcon size={14} color={styledTheme.colors.grey} />}
						{!hasSubpages && <LittleDot />}
					</Expander>
					<IconWrapper
						ref={setEmojiRef}
						active={emojiOpened}
						onClick={(e) => {
							if (readOnly) return
							setEmojiOpened(true)
						}}
						readOnly={readOnly}
					>
						{renderIcon(block?.metadata?.icon)}
					</IconWrapper>
					<StyledEditableTitle
						value={block?.data.text || 'Untitled'}
						editable={titleEditable}
						onChange={async (value) => {
							setTitleEditable(false)
							await updatePage.mutateAsync({ page, data: { text: value } })
						}}
						selected={selected}
						treeTheme={theme}
					/>
				</ContentWrapper>

				<Spacer />
				{!readOnly && !isDraggedOver && (
					<OptionsWrapper>
						<Options
							ref={setRef}
							active={menuOpened}
							visible={menuOpened && !isDraggedOver}
							onClick={(e) => {
								setMenuOpened(true)
							}}
						>
							<HorizontalDotsIcon size={14} color={styledTheme.colors.grey} />
						</Options>
						<Options
							isPlus={true}
							active={false}
							visible={menuOpened && !isDraggedOver}
							onClick={async (e) => {
								e.stopPropagation()
								const subpage = await createPage.mutateAsync({ name: '', parent: page })
								setPageId(subpage.id, { replace: false })
							}}
						>
							<PlusIcon size={14} color={styledTheme.colors.white} />
						</Options>
					</OptionsWrapper>
				)}
			</Container>

			{expanded && (
				<PagesList
					theme={theme}
					page={page}
					depth={depth + 1}
					readOnly={readOnly}
					parentIsDragging={isBeingDragged || parentIsDragging}
				/>
			)}
			{menuOpened && !isDraggedOver && (
				<PageMenu
					page={page}
					block={block}
					anchorRef={ref}
					onClose={() => setMenuOpened(false)}
					onRename={() => setTitleEditable(true)}
				/>
			)}
			{emojiOpened && !isDraggedOver && (
				<EmojiMenu
					anchorRef={emojiRef}
					onClose={() => setEmojiOpened(false)}
					onSelect={(emoji) => updatePage.mutate({ page, metadata: { icon: emoji } })}
				/>
			)}
		</div>
	)
}

const Options = styled.div<{ active: boolean; visible: boolean; isPlus?: boolean }>`
	align-items: center;
	justify-content: center;
	padding: 4px;
	border-radius: ${({ theme }) => theme.borderRadius};
	display: ${({ visible }) => (visible ? 'flex' : 'none')};
	background-color: ${({ theme, active, isPlus }) =>
		active ? theme.colors.activeDark : isPlus ? theme.colors.primary : undefined};

	&:hover {
		background-color: ${({ theme, isPlus }) => (isPlus ? theme.colors.primaryDark : theme.colors.activeDark)};
	}
`

const Container = styled.div<
	Pick<Props, 'depth'> & {
		isDraggedOver: boolean
		selected: boolean
		treeTheme?: ProjectTreeThemeType
	}
>`
	display: flex;
	align-items: center;
	height: 24px;
	padding: 4px 10px 4px ${({ depth }) => depth * 10 + 14}px;

	background-color: ${({ theme, selected, treeTheme, isDraggedOver }) => {
		if (isDraggedOver) return theme.colors.activeDark

		return selected ? (treeTheme === 'light' ? theme.colors.primaryExtraLight : theme.colors.activeDark) : 'transparent'
	}};

	border-bottom: 2px solid ${({ theme, isDraggedOver }) => (isDraggedOver ? theme.colors.primary : 'transparent')};

	cursor: pointer;
	transition: background-color 0.2s all ease;
	border-top: 2px solid transparent;

	&:hover {
		background-color: ${({ theme, selected, treeTheme }) =>
			selected ? undefined : treeTheme === 'light' ? theme.colors.primaryExtraLight : theme.colors.hoverDark};
	}

	&:hover ${Options} {
		display: flex;
	}
`

const Expander = styled.div<{ expanded: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px;
	border-radius: ${({ theme }) => theme.borderRadius};

	&:hover {
		background-color: ${({ theme }) => theme.colors.activeDark};
	}

	svg {
		transform: ${({ expanded }) => (expanded ? 'rotate(90deg)' : undefined)};
		transition: transform 0.3s ease;
	}
`

const ContentWrapper = styled.div`
	display: flex;
	align-items: center;
	overflow: hidden;
`

const IconWrapper = styled.div<{ active: boolean; readOnly?: boolean }>`
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

const LittleDot = styled.div`
	width: 4px;
	height: 4px;
	margin: 5px;
	border-radius: 90px;
	background: ${({ theme }) => theme.colors.grey};
`

const StyledEditableTitle = styled(EditableTitle)<{ selected: boolean; treeTheme?: ProjectTreeThemeType }>`
	width: 100%;
	color: ${({ theme, selected, treeTheme }) =>
		selected && treeTheme === 'light'
			? theme.colors.primary
			: treeTheme === 'light'
			? lighten(0.03, theme.colors.dark)
			: theme.colors.grey} !important;
`
