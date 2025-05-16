import { useState } from 'react'
import { Editor } from 'slate'
import { useSlate, useSlateSelection } from 'slate-react'
import styled from 'styled-components'
import { Menu } from '../Components/Menu'
import { MenuItem } from '../Components/Menu/MenuItem'
import { Show } from '../Components/Show'
import { useEditorMethods } from '../Contexts/EditorMethods.provider'

export enum RephraseTypes {
	Formal = 'formal',
	Expand = 'expand',
	Short = 'short',
	Fun = 'fun',
	Correct = 'correct',
}
export enum RephraseNames {
	Formal = 'Use formal tone',
	Expand = 'Make longer',
	Short = 'Make shorter',
	Fun = 'Use fun tone',
	Correct = 'Fix grammar',
}
export enum RephraseEmoji {
	Formal = '🎩',
	Expand = '📝',
	Short = '✂',
	Fun = '🤡',
	Correct = '✅',
}

interface ColorPickerProps {
	show: boolean
	setShow: (show: boolean) => void
	setAIIsLoading: (value: boolean) => void
}

export const HoveringAIMenu = ({ show, setShow, setAIIsLoading }: ColorPickerProps) => {
	const editor = useSlate()
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
	const selection = useSlateSelection()
	const { generateRephraseAIText } = useEditorMethods()
	const rephraseData = [
		{
			type: RephraseTypes.Correct,
			name: RephraseNames.Correct,
			emoji: RephraseEmoji.Correct,
		},
		{
			type: RephraseTypes.Expand,
			name: RephraseNames.Expand,
			emoji: RephraseEmoji.Expand,
		},
		{
			type: RephraseTypes.Short,
			name: RephraseNames.Short,
			emoji: RephraseEmoji.Short,
		},
		{
			type: RephraseTypes.Formal,
			name: RephraseNames.Formal,
			emoji: RephraseEmoji.Formal,
		},
		{
			type: RephraseTypes.Fun,
			name: RephraseNames.Fun,
			emoji: RephraseEmoji.Fun,
		},
	]

	async function rephraseSelection(type: RephraseTypes) {
		if (!selection) return

		setAIIsLoading(true)
		setShow(false)

		// Try/catch so the loader is always reset to false.
		try {
			const prompt = Editor.string(editor, selection)

			const text = generateRephraseAIText
				? await generateRephraseAIText(prompt, type)
				: 'No generateRephraseAIText method provided.'
			Editor.deleteFragment(editor)
			Editor.insertText(editor, text)
		} catch (e) {
			// console.error(e)
		}
		setAIIsLoading(false)
	}

	return (
		<div>
			<RefElement ref={setReferenceElement}></RefElement>
			<Show when={show}>
				<Menu
					closing={!show}
					anchorRef={referenceElement}
					offset={[0, 20]}
					onClose={() => setShow(false)}
					maxHeight={'360px'}
					placement="bottom"
				>
					{rephraseData.map(({ name, type, emoji }) => {
						return (
							<MenuItem
								text={<Text>{name}</Text>}
								icon={<IconWrapper>{emoji}</IconWrapper>}
								name={type}
								onClick={() => {
									rephraseSelection(type)
								}}
								key={type}
								style={{ textTransform: 'capitalize' }}
							/>
						)
					})}
				</Menu>
			</Show>
		</div>
	)
}

const IconWrapper = styled.div<any>`
	width: 22px;
	height: 22px;
	text-align: center;
	border-radius: 3px;
`

const Text = styled.div``

const RefElement = styled.div`
	width: 0px;
	height: 0px;
	background-color: transparent;
`
