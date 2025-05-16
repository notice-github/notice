import { FileModel, PageModel } from '@notice-app/models'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { NUrls } from '@notice-app/utils'
import { Breadcrumb } from '../../components/Breadcrumb/Breadcrumb'
import { Drawers } from '../../components/Drawer'
import { Loader } from '../../components/Loader'
import { Modals } from '../../components/Modal'
import { ReactTooltip } from '../../components/React-Tooltip'
import { Editor } from '../../containers/Editor'
import { ProjectSelector } from '../../containers/Modals/ProjectSelector'
import { useAIGenerateImage } from '../../hooks/api/useAIGenerateImage'
import { useAIGeneratePage } from '../../hooks/api/useAIGeneratePage'
import { useAIImageSuggestion } from '../../hooks/api/useAIImageSuggestion'
import { RephraseTypes, useAIRephrase } from '../../hooks/api/useAIRephrase'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUploadFile } from '../../hooks/api/useUploadFile'
import { useEditor } from '../../hooks/bms/editor/useEditor'
import { useEditorValue } from '../../hooks/bms/editor/useEditorValue'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { useDuplicatePage } from '../../hooks/bms/page/useDuplicatePage'
import { usePageBlock } from '../../hooks/bms/page/usePages'
import { useUpdatePage } from '../../hooks/bms/page/useUpdatePage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useProjects } from '../../hooks/bms/project/useProjects'
import { useUpdateProject } from '../../hooks/bms/project/useUpdateProject'
import { usePublish } from '../../hooks/bms/usePublish'
import { invalidatePublishState, usePublishState } from '../../hooks/bms/usePublishState'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useT } from '../../hooks/useT'
import { ArrowIcon } from '../../icons/Arrow.icon'
import { ZapIcon } from '../../icons/ZapIcon'
import { downloadAsFile } from '../../utils/file'
import { BMS, queryClient } from '../../utils/query'
import { EditorErrorBoundary } from './ErrorBoundary'

export const EditorPage = () => {
	const [workspace] = useCurrentWorkspace()
	const projects = useProjects(workspace)
	const [currentPage] = useCurrentPage()

	const theme = useTheme()
	const publish = usePublish()
	const publishState = usePublishState()
	const [loading, setLoading] = useState(false)

	const onExportJSON = async () => {
		const { data } = await BMS.get(`/blocks/${currentPage?.id}/graph`)
		const filename = (data.data.data.text as string).toLocaleLowerCase().normalize('NFD').replace(/ /g, '-')
		downloadAsFile(JSON.stringify(data.data, null, 2), 'application/json', `${filename}.json`)
	}

	const onExportMD = async () => {
		if (loading) return
		setLoading(true)

		try {
			if (publishState.data !== 'up_to_date' && currentPage != null) {
				await publish.mutateAsync({ block: currentPage })
				await invalidatePublishState(currentPage.id)
			}

			const markdown = await fetch(`${NUrls.App.bdn()}/document/${currentPage?.id}?format=markdown`).then((res) =>
				res.text()
			)
			downloadAsFile(markdown, 'text/plain', `${currentPage?.data.text ?? currentPage?.preferences?.projectTitle}.md`)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Padding id="scroll-to-top-target">
				<Breadcrumb />
				<FullWidthWrapper>
					{currentPage != null && <EditorContent page={currentPage} />}
					{projects.isFetched && (projects.data?.length ?? 0) <= 0 && (
						<PlaceholderWrapper>
							<ProjectSelector />
						</PlaceholderWrapper>
					)}
				</FullWidthWrapper>
			</Padding>
		</>
	)
}

const ExportButtons = styled.div`
	display: flex;
	gap: 16px;
	justify-content: center;
	align-items: center;
	margin-bottom: 24px;
`

// Takes the full width of the page and center the child
const FullWidthWrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	/* add 60px to match rendering */
	max-width: calc(var(--ntc-user-max-width) + 73px);
	min-height: 100vh;
	height: fit-content;

	display: flex;
	justify-content: center;
	margin: 0 auto;
	background-color: white;
	border: 1px solid ${({ theme }) => theme.colors.border};
	margin-bottom: 42px;
`

const LoaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
	max-width: 690px;
	margin-top: 100px;
`

const Padding = styled.div`
	box-sizing: border-box;
	padding: 12px;

	height: auto;
`

const PlaceholderWrapper = styled.div`
	width: fit-content;
	height: fit-content;
	margin: 24px auto;
`

interface EditorContentProps {
	page: PageModel.node
}

export const EditorContent = ({ page }: EditorContentProps) => {
	const [currentWorkspace] = useCurrentWorkspace()
	const [currentProject] = useCurrentProject()
	const [pageId, setPageId] = useSearchParam('page')

	const generateAIImage = useAIGenerateImage()
	const generateAIPage = useAIGeneratePage()
	const AIImageSuggestion = useAIImageSuggestion()
	const generateRephraseAIText = useAIRephrase()
	const uploadFile = useUploadFile()
	const updatePage = useUpdatePage()
	const updateProject = useUpdateProject()
	const duplicatePage = useDuplicatePage()
	const [t] = useT()

	const [editor, setEditor] = useEditor(page)
	const [value, setValue] = useEditorValue(page)

	const block = usePageBlock(page)

	useEffect(() => {
		setTimeout(() => {
			const target = document.getElementById('scroll-to-top-target')
			if (target) target.scrollIntoView()
		}, 100)
	}, [pageId])

	useEffect(() => {
		const onSave = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				setValue(value.data, true)
			}
		}

		document.addEventListener('keydown', onSave)
		return () => document.removeEventListener('keydown', onSave)
	}, [value.data])

	const editorMethods = {
		generateAIImage: async (prompt: string, style?: string, destroyElement?: () => void) => {
			const image = await generateAIImage.mutateAsync({
				style: style as any,
				description: prompt,
				workspace: currentWorkspace,
				destroyElement,
			})

			return image
		},
		generateAIPage: async (prompt: string, setMdResponse: (s: string) => void, destroyElement?: () => void) => {
			const text = await generateAIPage.mutateAsync({
				prompt,
				workspace: currentWorkspace,
				setMdResponse,
				destroyElement,
			})

			return text
		},
		generateRephraseAIText: async (prompt: string, type: RephraseTypes) => {
			const text = await generateRephraseAIText.mutateAsync({ text: prompt, type, workspace: currentWorkspace })

			return text
		},
		imageSuggestion: async (text: string) => await AIImageSuggestion.mutateAsync({ text, workspace: currentWorkspace }),
		openImageUploader: (onSelected?: (file: FileModel.client) => any) => {
			return Drawers.imageUploader.open({
				onSelected: onSelected ?? ((file) => editor.insertImage(file)),
			})
		},
		openVideoUploader: (onSelected?: (file: FileModel.client) => any) => {
			return Drawers.videoUploader.open({
				onSelected: onSelected ?? ((file) => editor.insertVideo(file)),
			})
		},
		openDocumentUploader: (onSelected?: (file: FileModel.client) => any) => {
			return Drawers.documentUploader.open({
				onSelected: onSelected ?? ((file) => editor.insertDocument(file)),
			})
		},
		openAudioUploader: (onSelected?: (file: FileModel.client) => any) => {
			return Drawers.audioUploader.open({
				onSelected: onSelected ?? ((file) => editor.insertAudio(file)),
			})
		},
		changePage: (id?: string) => {
			if (id == null) return

			setPageId(id, { replace: false })
		},
		onUploadFile: async (file: File, type?: 'image' | 'video' | 'application') => {
			const result = await uploadFile.mutateAsync({
				workspace: currentWorkspace,
				file,
				type,
			})

			return result
		},
		getPageValue: (id?: string) => {
			if (id == null) return
			return queryClient.getQueryData<any[]>(['slate-page-value', id, null])
		},
		deletePage: (id?: string) => {
			if (id == null) return
			Modals.deletePageConfirmation.open({ page: { id, rootId: page.rootId } })
		},
		duplicatePage: (id?: string) => {
			if (id == null) return
			duplicatePage.mutate({ page: { id, rootId: page.rootId } })
		},
	}

	const isRoot = page.rootId === page.id

	return (
		<EditorWrapper>
			{!value.isFetched ? (
				<LoaderWrapper>
					<Loader />
				</LoaderWrapper>
			) : (
				<EditorErrorBoundary value={value.data} setValue={setValue}>
					{!isRoot && (
						<>
							<ReactTooltip anchorSelect=".anchor-tooltip-meta" place="top">
								{t('Metadata', 'metadata')}
							</ReactTooltip>
							<Metabutton
								className="anchor-tooltip-meta"
								data-tooltip-delay-show={750}
								onClick={() => {
									Modals.pageMetadata.open({ page })
								}}
							>
								<ZapIcon color={'none'} size={22} fill="white" />
							</Metabutton>
							<ArrowMetaButton
								onClick={() => {
									Modals.contentScore.open({ page })
								}}
							>
								<ArrowIcon color={'white'} size={18} fill="white" />
							</ArrowMetaButton>
						</>
					)}
					<Editor
						key={`${page.id}-${value.dataUpdatedAt}`}
						value={value.data}
						setValue={setValue}
						title={block?.data.text ?? ''}
						setTitle={(title) => {
							if (page.id === currentProject?.id) {
								updateProject.mutate({ project: currentProject, workspace: currentWorkspace, data: { text: title } })
							} else {
								updatePage.mutate({ page, data: { text: title } })
							}
						}}
						setEditor={setEditor}
						editorMethods={editorMethods}
						editorOptions={{ lang: currentProject?.preferences?.defaultLanguage ?? 'en' }}
						noPadding={false}
					/>
				</EditorErrorBoundary>
			)}
		</EditorWrapper>
	)
}

const Metabutton = styled.div`
	position: absolute;
	right: -17px;
	top: 26px;
	z-index: 999;
	border-radius: 50%;
	width: 29px;
	height: 29px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border: 2px solid #9ba9b5;
	background-color: #9ba9b5;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
	transition: 0.1s ease-in-out;

	path {
		transition: 0.1s ease-in-out;
	}

	svg {
		transition: 0.1s ease-in-out;
	}

	:hover {
		top: 24px;

		svg {
			fill: #f38181 !important;
			height: 28px;
			width: 28px;
		}
	}
`

const ArrowMetaButton = styled(Metabutton)`
	top: 70px;
	:hover {
		top: 68px;

		svg {
			fill: transparent !important;

			height: 21px;
			width: 21px;
		}

		path {
			stroke: #f38181 !important;
		}
	}
`

// Contains the editor, max-width to optimize readability and match bundle styling
const EditorWrapper = styled.div`
	position: relative;
	width: 100%;
	/* match editor width */
	flex-grow: 1;

	/* show otherwise the hover icon isn't showing */
	overflow-y: show;
`
