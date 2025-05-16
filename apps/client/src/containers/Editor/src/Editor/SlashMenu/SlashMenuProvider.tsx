import React, { ReactNode, useContext, useEffect, useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

interface Pos {
	x: number
	y: number
}

export type SetSlashOpen = (value: boolean, addSlash?: boolean) => void

interface SlashMenuContext {
	slashOpen: boolean
	setSlashOpen: SetSlashOpen
	menuPos: Pos
}

interface SlashMenuProviderProps {
	children: ReactNode
}

// Disable scrolling
export const disableScroll = () => {
	const mainLayout = document.getElementById('mainLayout')
	if (mainLayout) {
		mainLayout.style.overflow = 'hidden'
	}
}

// Enable scrolling
export const enableScroll = () => {
	const mainLayout = document.getElementById('mainLayout')
	if (mainLayout) {
		mainLayout.style.overflow = 'auto'
	}
}

export const SlashMenuContext = React.createContext<SlashMenuContext | null>(null)

export const SlashMenuProvider = ({ children }: SlashMenuProviderProps) => {
	const [open, setOpen] = useState(false)
	const [menuPos, setMenuPos] = useState<Pos>({ x: 0, y: 0 })
	const editor = useSlate()

	useEffect(() => {
		if (open) {
			disableScroll()
		} else {
			enableScroll()
		}
		return () => {
			enableScroll()
		}
	}, [open])

	const setSlashMenuOpen = (value: boolean, addSlash?: boolean) => {
		if (value) {
			const { selection } = editor

			if (!selection) return

			addSlash && Transforms.insertText(editor, '/') // display slash so user can understand they can search for block same like notion
			const domRange = ReactEditor.toDOMRange(editor, selection)
			const bcr = domRange.getBoundingClientRect()

			// do not change the position, the getBoundingClientRect() is not working
			if (bcr.x === 0 && bcr.x === 0) return

			// move the menu reference to the cursor position
			if (editor.selection === null) return

			setMenuPos({ x: bcr.x, y: bcr.y })
		}
		setOpen(value)
	}

	return (
		<SlashMenuContext.Provider value={{ slashOpen: open, setSlashOpen: setSlashMenuOpen, menuPos }}>
			{children}
		</SlashMenuContext.Provider>
	)
}

export const useSlashMenu = () => {
	const context = useContext(SlashMenuContext)
	if (context === null) throw new Error('Received null while reading useContext(SlashMenuContext).')
	return context
}
