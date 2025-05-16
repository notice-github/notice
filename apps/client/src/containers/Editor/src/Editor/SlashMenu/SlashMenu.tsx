// libs
import { useEffect, useRef, useState } from 'react'
import { ReactEditor, useSlate } from 'slate-react'
import styled from 'styled-components'

// components
import { Editor, Selection, Transforms } from 'slate'
import { Menu } from '../Components/Menu'
import { MenuItem } from '../Components/Menu/MenuItem'
import { MenuSectionTitle } from '../Components/Menu/MenuSectionTitle'
import { Show } from '../Components/Show'
import { EditorMethodsContext, useEditorMethods } from '../Contexts/EditorMethods.provider'
import { menuItems } from './SlashMenuItems'
import { useSlashMenu } from './SlashMenuProvider'

export const SlashMenu = () => {
	const { slashOpen, menuPos, setSlashOpen } = useSlashMenu()
	const editorMethods = useEditorMethods()
	const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
	const [initialSelect, setInitialSelect] = useState<Selection | undefined>(undefined)
	const editor = useSlate()
	const ref = useRef<HTMLDivElement | null>()

	// this use effect set the position of the menu
	useEffect(() => {
		if (!slashOpen) return
		const el = ref.current
		const { selection } = editor
		if (!el?.style || !selection) return

		setInitialSelect(selection)
		el.style.opacity = '1'
		el.style.top = `${menuPos.y + window.scrollY - el.offsetHeight}px`
		el.style.left = `${menuPos.x + window.scrollX - el.offsetWidth}px`
	}, [slashOpen])

	function makeAction(action: (editor: Editor, methods?: EditorMethodsContext) => void) {
		// WARNING SENSITIVE STUFF
		setSlashOpen(false)

		ReactEditor.focus(editor)

		// select back the initial node, go to the end of the line, then delete the last word
		if (initialSelect && Editor.string(editor, initialSelect.anchor.path)) {
			Transforms.select(editor, initialSelect)

			// check if the user searched something '/' if so move the line and delete search and slash
			if (Editor.string(editor, initialSelect.anchor.path).length > 1) {
				Transforms.move(editor, { unit: 'word' })
				Editor.deleteBackward(editor, { unit: 'line' })
			} else {
				// just delete the slash
				Editor.deleteBackward(editor, { unit: 'line' })
			}
		}

		action(editor, editorMethods)

		// END OF WARNING SENSITIVE STUFF
	}

	return (
		<StyledMenu
			ref={ref}
			// @ts-ignore
			onMouseDown={(e) => {
				// prevent toolbar from taking focus away from editor
				e.preventDefault()
			}}
			onKeyDown={(e: KeyboardEvent) => {
				if (e.key === '/') {
					e.preventDefault()
					setSlashOpen(false)

					ReactEditor.focus(editor)
				}
			}}
		>
			<RefElement ref={setReferenceElement}></RefElement>
			<Show when={slashOpen}>
				<Menu
					closing={!slashOpen}
					anchorRef={referenceElement}
					offset={[0, 10]}
					onClose={() => setSlashOpen(false)}
					searchable
					maxHeight={'360px'}
					searchPlaceholder="Type your block..."
					minWidth={'280px'}
					initialSelect={initialSelect}
				>
					{menuItems.map((item) => {
						if (item?.subtype === 'SectionTitle') {
							return (
								<MenuSectionTitle name={item?.label} key={item?.label} text={item?.label} subtype={item?.subtype} />
							)
						}
						const { label, name, icon, action, keywords, subtype } = item

						const key = name
						return (
							<MenuItem
								icon={icon}
								text={label}
								name={name}
								onClick={() => makeAction(action)}
								key={key}
								keywords={keywords}
								subtype={subtype}
							/>
						)
					})}
				</Menu>
			</Show>
		</StyledMenu>
	)
}

const RefElement = styled.div`
	width: 0px;
	height: 0px;
	background-color: transparent;
`

const StyledMenu = styled.div<any>`
	display: flex;
	padding: 8px 7px 6px;
	position: fixed;
	z-index: 1;
	top: -10000px;
	left: -10000px;
	margin-top: 18px;
	width: 0px;
	height: 0px;
	opacity: 0;
	background-color: transparent;
	transition: opacity 0.75s;
`
