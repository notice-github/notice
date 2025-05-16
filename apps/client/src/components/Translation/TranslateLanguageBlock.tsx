import { BlockModel } from '@notice-app/models'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Editor } from '../../containers/Editor'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useLostSavingConfirmation } from '../../hooks/api/useLostSavingConfirmation'
import { useEditor } from '../../hooks/bms/editor/useEditor'
import { useEditorValue, useSlateValue } from '../../hooks/bms/editor/useEditorValue'
import { usePagesGraph } from '../../hooks/bms/page/usePages'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useBlockLang } from '../../hooks/bms/translation/useBlockLang'
import useDebounce from '../../hooks/useDebounce'
import { useSearchParam } from '../../hooks/useSearchParam'
import { useSearchParams } from '../../hooks/useSearchParams'
import { NLanguages } from '../../utils/languages'
import { Loader } from '../Loader'
import { TranslateActions } from './TranslateActions'
import { TranslateToTopBar, TranslationStatusTypes } from './TranslateToTopBar'
import { TranslationTitle } from './TranslationTitle'
import {
	exclusionList,
	findNonEmptyBlockIndex,
	getFlatBlocksMap,
	getNextPrevPage,
	highlightBlock,
	triggerEditorFocus,
	unlightBlock,
	updateHTMLStatusClasses,
} from './helpers'
import { useAvailableLanguages } from './useUpdateAvailableLanguages'

interface Props {
	page: BlockModel.block
}
export type StatusMapType = {
	[key: string]: TranslationStatusTypes
}

export const TranslateLanguageBlock = ({ page }: Props) => {
	// theme
	const theme = useTheme()

	// queries
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()
	const [params, setParams] = useSearchParams()
	const lang = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE
	const [, updateAvailableLanguages] = useAvailableLanguages()

	// lang values
	const [langSlateValue] = useSlateValue(page, lang)
	const langEditorValue = langSlateValue.isFetched && langSlateValue.data.children

	// default values
	const [defaultLangVal] = useEditorValue(page)
	const [slateValue] = useSlateValue(page)

	const [blockLang, updateBlockInLang] = useBlockLang(page)

	const [editor, setEditor] = useEditor(page)

	// local states
	const [editorValue, setEditorValue] = useState(langEditorValue ?? null)
	const wrapperRef = useRef(null)
	const [debouncedEditorValue, isDebouncing] = useDebounce(editorValue, 500)
	const [blockStatusMap, setBlockStatusMap] = useState<StatusMapType>({})

	// used for next/previous pages nav
	const pagesGraph = usePagesGraph(project?.id)
	const [, setPageId] = useSearchParam('page')
	useLostSavingConfirmation(updateBlockInLang.isLoading || isDebouncing)

	// Flatten array of all the blocks contained in the page
	const [allBlocks, allBlocksMap] = getFlatBlocksMap(slateValue.data)

	// Flatten array of all the lang blocks contained in the page
	const [allBlocksLangArray, allBlocksLangMap] = getFlatBlocksMap(langSlateValue.data, allBlocksMap)

	// This is a an array that contains all the blocks, including the parent
	const selectedBlock = allBlocksLangMap[params.block as string]

	// if the number of blocks in the default language is different from the translated language
	// it means the translated data is not synced (happens when a new block is added to the default language)
	// refetch the data
	const needToSyncData =
		langEditorValue && defaultLangVal.isFetched && langEditorValue.length !== defaultLangVal?.data?.length

	const [titleData, setTitleData] = useState({ title: '', lang: '' })
	const [titleDebounced, isDebouncingTitle] = useDebounce(titleData, 500)

	useEffect(() => {
		langSlateValue.refetch()
	}, [])

	useEffect(() => {
		const titleBlock = allBlocksLangArray[0]
		if (titleDebounced.lang?.length < 1 || titleDebounced?.title === titleBlock?.text) return

		if (!isDebouncingTitle && titleBlock?.id) {
			updateBlockInLang.mutateAsync({
				block: { ...titleBlock, text: titleDebounced?.title },
				workspace,
				data: {
					text: titleDebounced?.title,
					type: 'page',
					id: titleBlock?.id,
				},
				isPage: true,
				lang: titleDebounced.lang,
			})
		}
	}, [titleDebounced])

	useEffect(() => {
		if (!selectedBlock && allBlocks?.length && blockLang?.isFetched) {
			setParams({ block: allBlocks[0].id }, { replace: false })
		}
	}, [slateValue.isFetched, allBlocks?.length, blockLang.isFetched])

	// send the save block request to the server (debounced)
	useEffect(() => {
		if (!selectedBlock || !debouncedEditorValue?.length) return

		updateBlockInLang.mutateAsync({ block: selectedBlock, workspace, data: debouncedEditorValue[0] })
	}, [debouncedEditorValue])

	// when the selectedBlock changes, focus the editor (by using the onClick action of the element)
	useEffect(() => {
		if (selectedBlock?.id) triggerEditorFocus(selectedBlock?.id)
	}, [selectedBlock?.id])

	// add the onclick event to the read only blocks
	// and the status indicator
	useEffect(() => {
		if (!allBlocksLangArray) return

		const newMap: StatusMapType = {}

		allBlocksLangArray.map((block: any, index) => {
			const { completedAt, updatedAt } = block.metadata ?? {}
			const completedAtDate = dayjs(completedAt)
			const updatedAtDate = dayjs(updatedAt)
			const isAfter = completedAtDate.isAfter(updatedAtDate)

			// if (allBlocksMap && isBlockEmpty(allBlocksMap[block.id])) return

			if (!completedAt) {
				newMap[block.id] = 'notTranslated'
			} else if (isAfter || !updatedAt) {
				newMap[block.id] = 'translated'
			} else {
				newMap[block.id] = 'outOfDate'
			}
		})

		setBlockStatusMap(newMap)

		// for some reason, the DOM is not fully mounted when the useEffect is called
		setTimeout(() => {
			var anchors = document.getElementsByClassName('readonly-handler')

			for (var i = 0; i < anchors.length; i++) {
				const anchor: any = anchors[i]
				const block = allBlocksLangMap[anchor.id]
				// if (isBlockEmpty(block)) continue

				anchor.onclick = function () {
					setParams({ block: block.id }, { replace: false })
				}

				updateHTMLStatusClasses({ anchor, newMap })
			}
		}, 300)
	}, [slateValue.data, langSlateValue.data])

	// refetch when the editor is out of sync
	useEffect(() => {
		if (needToSyncData && defaultLangVal?.data?.length > 0) {
			langSlateValue.refetch()
			slateValue.refetch()

			return
		}
	}, [needToSyncData, defaultLangVal?.data?.length])

	// set the block and highlight
	useEffect(() => {
		if (!langSlateValue.isFetched && selectedBlock) return

		allBlocksLangArray.forEach((block: any) => {
			unlightBlock(block.id)
		})

		if (selectedBlock && (!exclusionList.includes(selectedBlock.type) || selectedBlock.type === 'page')) {
			highlightBlock(selectedBlock.id, theme, wrapperRef)
		}
	}, [allBlocksLangArray, lang, selectedBlock])

	if (langSlateValue.isFetched && !allBlocksLangArray?.length) {
		return <div>Empty page, nothing to translate</div>
	}

	// onChange when translating (debounced)
	function setBlockLangValue(editorValue: any) {
		if (!selectedBlock || !lang) return

		setEditorValue(editorValue)
		// let's update the available languages if the language is not in the list
		// it happens when the user is using the initialValue set by the app ('en' or 'fr')
		updateAvailableLanguages(lang)
	}

	function goToBlock(order: 'next' | 'previous') {
		const currentIndex = selectedBlock.index || 0

		const nextBlock = findNonEmptyBlockIndex(allBlocksLangArray, currentIndex, order)

		if (nextBlock) setParams({ block: nextBlock.id }, { replace: false })
		else if (pagesGraph.data) {
			const nextOrPrevaPageId = getNextPrevPage(pagesGraph.data, order, page.id)
			setPageId(nextOrPrevaPageId, { replace: false })
		}
	}

	if (needToSyncData) {
		return (
			<div>
				Syncing data...
				<Loader />
			</div>
		)
	}

	if (!langSlateValue.isFetched || !selectedBlock?.id) return <></>

	const status = blockStatusMap[selectedBlock.id]

	return (
		<Wrapper>
			<TopContainer>
				<TranslateToTopBar />
				<Divider />
				<AbsoluteContainer>
					{/* we check for absence of !.text because... it created a weird bug
					sorry I don't have more info */}
					{selectedBlock?.type !== 'page' && !selectedBlock.text ? (
						<TranslateBlockWrapper ref={wrapperRef}>
							<Editor
								key={`${selectedBlock.id}-${lang}`}
								setValue={setBlockLangValue}
								value={[selectedBlock]}
								wrapperRef={wrapperRef}
								editorOptions={{ editOnly: true, lang: lang ?? 'en' }}
								noPadding={true}
								setEditor={setEditor}
							/>
						</TranslateBlockWrapper>
					) : (
						<TranslationTitle
							page={page}
							editable={true}
							value={selectedBlock?.text}
							id={selectedBlock?.id}
							lang={lang}
							data={titleData}
							setData={setTitleData}
						/>
					)}
				</AbsoluteContainer>
			</TopContainer>

			<TranslateActions
				goToNextBlock={() => goToBlock('next')}
				goToPreviousBlock={() => goToBlock('previous')}
				block={selectedBlock}
				allBlocksMap={allBlocksMap}
				status={status}
				setBlockLangValue={setBlockLangValue}
				editor={editor}
				setTitleData={setTitleData}
			/>
		</Wrapper>
	)
}

const TopContainer = styled.div``

const Divider = styled.div`
	margin-top: 16px;
	width: 100%;
	border-bottom: 2.5px solid ${({ theme }) => theme.colors.borderLight};
`

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	width: 100%;
	position: relative;
	border-radius: 8px;
	padding: 8px;
	padding-top: 12px;
	padding-bottom: 12px;
	box-sizing: border-box;
`

const AbsoluteContainer = styled.div<any>`
	width: 100%;
	margin-top: 16px;
	background-color: ${({ theme }) => theme.colors.white};
	border-radius: 8px;
	border: 1.5px solid ${({ theme }) => theme.colors.borderLight};
`

const TranslateBlockWrapper = styled.div`
	padding: 8px;

	li {
		list-style-type: none !important;
	}
`
