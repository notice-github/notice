import { useState } from 'react'
import styled from 'styled-components'
import { AddColumn, SixDotsIcon, TrashIcon } from '../../../Icons'
import { Menu } from '../../Components/Menu'
import { MenuItem } from '../../Components/Menu/MenuItem'
import { MenuSeparator } from '../../Components/Menu/MenuSeparator'
import { Show } from '../../Components/Show'
import useTable from '../../hooks/useTable'
import { TableContent } from './Table'

interface IProps {
	setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
	menuOpened: boolean
	content: TableContent
	currentIndex: number
}

export const HeaderMenuButton = ({ menuOpened, setMenuOpened, content, currentIndex }: IProps) => {
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	return (
		<>
			<IconButton ref={setRef} onClick={() => setMenuOpened(true)}>
				<SixDotsIcon />
			</IconButton>
			<Show when={menuOpened}>
				<HeaderSettingsMenu
					content={content}
					currentIndex={currentIndex}
					anchorRef={ref}
					onClose={() => setMenuOpened(false)}
				></HeaderSettingsMenu>
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

const HeaderSettingsMenu = <T extends HTMLElement>({ anchorRef, onClose, content, currentIndex }: Props<T>) => {
	const [closing, setClosing] = useState(false)
	const { insertColumn, deleteColumn } = useTable()

	const handleInsertColumnToLeft = () => {
		insertColumn(content, currentIndex === 0 ? 0 : currentIndex)
		setClosing(true)
	}

	const handleInsertColumnToRight = () => {
		insertColumn(content, currentIndex + 1)
		setClosing(true)
	}
	const handleColumnDeletion = () => {
		deleteColumn(content, currentIndex)
		setClosing(true)
	}

	return (
		<Menu closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<MenuItem
				icon={<AddColumn style={{ transform: 'rotate(180deg)' }} size={20} />}
				text="Column To Left"
				onClick={handleInsertColumnToLeft}
				name={'columnToLeft'}
				key={'column_to_left'}
			/>
			<MenuItem
				icon={<AddColumn size={20} />}
				text="Column To Right"
				onClick={handleInsertColumnToRight}
				name={'columnToRight'}
				key={'column_to_right'}
			/>
			<MenuSeparator />
			<MenuItem
				name={'delete column'}
				icon={<TrashIcon size={20} />}
				text="Delete Column"
				onClick={handleColumnDeletion}
				key={'delete_column'}
			/>
		</Menu>
	)
}

const IconButton = styled.div`
	width: auto;
	border-radius: 50%;
	text-align: center;
	position: absolute;
	right: 6px;
	top: 14px;

	cursor: pointer;
`
