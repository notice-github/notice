import { BlockModel } from '@notice-app/models'
import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { Show } from '../../../components/Show'
import { DoneIcon } from '../../../icons/DoneIcon'
import { Loader } from '../../../components/Loader'
import { useEditorState } from '../../../hooks/bms/editor/useEditorState'
import { CrossIcon } from '../../../icons'

interface Props {
	page: BlockModel.block
}

export const StateIndicator = ({ page }: Props) => {
	const theme = useTheme()
	const editorState = useEditorState(page)

	const [displayed, setDisplayed] = useState(false)

	useEffect(() => {
		if (['saved', 'error'].includes(editorState)) {
			const timeout = setTimeout(() => {
				setDisplayed(false)
			}, 2000)

			return () => clearTimeout(timeout)
		} else {
			setDisplayed(true)
		}
	}, [editorState])

	useEffect(() => {
		if (editorState === 'saved') setDisplayed(false)
	}, [page])

	return (
		<Container>
			<Show when={editorState === 'modified'}>Modified</Show>
			<Show when={displayed && editorState === 'saved'}>
				<DoneIcon size={16} color={theme.colors.textLightGrey} />
				Saved
			</Show>
			<Show when={editorState === 'saving'}>
				<Loader size={14} color={theme.colors.textLightGrey} />
				Saving
			</Show>
			<Show when={displayed && editorState === 'error'}>
				<CrossIcon size={10} color={theme.colors.textLightGrey} style={{ marginRight: '4px' }} />
				Error
			</Show>
		</Container>
	)
}

const Container = styled.div`
	/* margin-right: 16px; */
	color: ${({ theme }) => theme.colors.textLightGrey};
	display: flex;
	align-items: center;
	gap: 6px;
`
