import { BlockModel } from '@notice-app/models'
import { useEffect } from 'react'
import styled from 'styled-components'
import { Editor } from '../../containers/Editor'
import { useEditorValue, useSlateValue } from '../../hooks/bms/editor/useEditorValue'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Loader } from '../Loader'
import { TranslateLanguageBlock } from './TranslateLanguageBlock'
import { TranslationTitle } from './TranslationTitle'

export const CardTranslator = () => {
	const [project] = useCurrentProject()
	const [page] = useCurrentPage()
	if (!project?.preferences?.defaultLanguage || !page) return <></>

	if (!page) return <Loader />

	return (
		<Wrapper>
			<DefaultLanguageBlock>
				<ReadOnlyEditor page={page} />
			</DefaultLanguageBlock>
			<TranslateWrapper>{page && <TranslateLanguageBlock page={page} />}</TranslateWrapper>
		</Wrapper>
	)
}

interface ReadOnlyEditorProps {
	page: BlockModel.block
}

const ReadOnlyEditor = ({ page }: ReadOnlyEditorProps) => {
	const [project] = useCurrentProject()
	const [value] = useEditorValue(page)
	const [slateValue] = useSlateValue(page)
	const [, setPageId] = useSearchParam('page')

	const editorMethods = {
		changePage: (id?: string) => {
			if (id == null) return
			setPageId(id, { replace: false })
		},
	}

	useEffect(() => {
		slateValue.refetch()
	}, [])

	const lang = project?.preferences?.defaultLanguage ?? 'en'

	if (!slateValue.isFetched) return <Loader />

	return (
		<ReadOnlyEditorWrapper>
			<TranslationTitle page={page} value={slateValue?.data?.text} id={slateValue?.data?.id} lang={lang} />
			{value.isFetched && (
				<Editor
					key={page.id}
					value={value.data}
					editorOptions={{ readOnly: true, lang }}
					editorMethods={editorMethods}
				/>
			)}
		</ReadOnlyEditorWrapper>
	)
}

const ReadOnlyEditorWrapper = styled.div`
	max-height: 90%;
	overflow: auto;
	padding: 8px 16px 32px 32px;
	padding-left: 32px;
	* {
		cursor: not-allowed !important;
	}
`
const TranslateWrapper = styled.div`
	flex: 50%;
`

const DefaultLanguageBlock = styled.div`
	height: 100%;
	max-height: 100%;
	max-width: 48%;
	flex: 50%;
	position: relative;

	.translation-out-of-date {
		.readonly-handler-circle {
			border-color: ${({ theme }) => theme.colors.warning};
			background-color: ${({ theme }) => theme.colors.warning};
		}
	}

	.translation-translated {
		.readonly-handler-circle {
			border-color: ${({ theme }) => theme.colors.success};
			background-color: ${({ theme }) => theme.colors.success};
		}
	}

	.translation-not-translated {
		.readonly-handler-circle {
			border-color: ${({ theme }) => theme.colors.grey};
			background-color: ${({ theme }) => theme.colors.grey};
		}
	}

	.readonly-handler-circle {
		height: 10px;
		width: 10px;
		border-radius: 50%;
		padding: 5px;
		cursor: pointer !important;
	}

	.readonly-handler {
		padding: 10px;

		cursor: pointer !important;

		transition: all 0.2s ease-in-out;

		:hover.not-empty-block-status {
			.readonly-handler-circle {
				background-color: ${({ theme }) => theme.colors.primaryLight};
			}
		}

		position: absolute;
		left: -40px;
		margin-top: -5px;
	}

	.notice-block-wrapper {
		transition: all 0.4s ease-in-out;
		border-right: 6px solid transparent;
		padding-right: 8px;
		li {
			list-style-type: none;
		}

		[data-slate-node='element'] {
			transition: all 0.4s ease-in-out;
			opacity: 0.5;
		}
		&.translate-highlighted {
			border-right: 6px solid ${({ theme }) => theme.colors.primaryLight};
			.readonly-handler-circle {
				background-color: ${({ theme }) => theme.colors.primaryLight};
			}

			[data-slate-node='element'] {
				opacity: 1;
			}
		}
	}
`

const Wrapper = styled.div`
	height: 100%;
	gap: 16px;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	overflow: auto;
`
