import { useState } from 'react'
import styled from 'styled-components'
import { Expand, InsertAbove, InsertBelow, SixDotsIcon, TrashIcon } from '../../../Icons'
import { Menu } from '../../Components/Menu'
import { MenuItem } from '../../Components/Menu/MenuItem'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { Show } from '../../Components/Show'
import { useTableRowsModalState } from '../../Providers/TableRowsModal'
import useTable from '../../hooks/useTable'
import { TableContent } from './Table'

interface IProps {
	setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
	menuOpened: boolean
	content: TableContent
	currentIndex: number
}

export const RowMenuButton = ({ menuOpened, setMenuOpened, currentIndex, content }: IProps) => {
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	return (
		<>
			<IconButton ref={setRef} onClick={() => setMenuOpened(true)}>
				<SixDotsIcon />
			</IconButton>
			<Show when={menuOpened}>
				<RowSettingsMenu
					content={content}
					currentIndex={currentIndex}
					anchorRef={ref}
					onClose={() => setMenuOpened(false)}
				></RowSettingsMenu>
			</Show>{' '}
		</>
	)
}

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any
	content: TableContent
	currentIndex: number
}

const RowSettingsMenu = <T extends HTMLElement>({ anchorRef, onClose, content, currentIndex }: Props<T>) => {
	const [closing, setClosing] = useState(false)

	const { insertRow, deleteRow } = useTable()
	const { setOpened, setActiveIndex } = useTableRowsModalState()

	const handleInsertAbove = () => {
		insertRow(content, currentIndex === 0 ? 0 : currentIndex)
		setClosing(true)
	}

	const handleInsertBelow = () => {
		insertRow(content, currentIndex + 1)
		setClosing(true)
	}

	const handleRowDeletion = () => {
		deleteRow(content, currentIndex)
		setClosing(true)
	}

	const handleOpenRows = () => {
		setActiveIndex(currentIndex)
		setOpened(true)
		setClosing(true)
	}

	return (
		<>
			<Menu closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
				<MenuItem
					icon={<Expand size={18} />}
					text="Open Row"
					onClick={handleOpenRows}
					key={'open row'}
					name={'open_row'}
				/>
				<MenuItem
					icon={<InsertAbove size={18} />}
					text="Insert Above"
					onClick={handleInsertAbove}
					name={'insert above'}
					key={'insert_above'}
				/>
				<MenuItem
					icon={<InsertBelow size={18} />}
					text="Insert Below"
					onClick={handleInsertBelow}
					name={'insert below'}
					key={'insert_below'}
				/>
				<MenuSeparator />
				<MenuItem name={'delete row'} icon={<TrashIcon size={20} />} text="Delete Row" onClick={handleRowDeletion} />
			</Menu>
		</>
	)
}

const IconButton = styled.div`
	width: auto;
	border-radius: 50%;
	text-align: center;
	position: absolute;

	display: flex;
	justify-content: center;
	align-items: center;

	left: 6px;

	cursor: pointer;
`
