import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { darken } from 'polished'
import { ChevronIcon } from '../../../icons/ChevronIcon'
import { Menu } from '../../Menu'
import { MenuItem } from '../../Menu/MenuItem'

interface Props {
	currentValue: string
	values: Record<string, string>[]
	onUpdate?: (value: string) => any
}

export const SelectCustomisationMenu = ({ currentValue, onUpdate, values }: Props) => {
	const theme = useTheme()

	const currentName = values.find((value) => value.value === currentValue)?.name ?? 'Unknown'
	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLButtonElement | null>(null)

	return (
		<>
			<Button ref={setRef} onClick={() => setMenuOpened(true)}>
				{currentName}
				<ChevronIcon color={theme.colors.textDark} size={14} style={{ transform: 'rotate(90deg)' }} />
			</Button>
			{menuOpened && (
				<DropdownMenu
					values={values}
					anchorRef={ref}
					onSelect={(value) => {
						onUpdate?.call(onUpdate, value)
					}}
					onClose={() => setMenuOpened(false)}
				/>
			)}
		</>
	)
}

const Button = styled.button`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 12px;
	padding: 8px 16px;

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	background-color: ${({ theme }) => theme.colors.white};

	font-size: 14px;
	color: ${({ theme }) => theme.colors.textDark};
	white-space: nowrap;

	cursor: pointer;

	&:hover {
		background-color: ${({ color }) => darken(0.05, color ?? 'white')};
	}
`

interface MenuProps<T> extends Pick<Props, 'values'> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	onSelect?: (value: string) => any
}

const DropdownMenu = <T extends HTMLElement>({ anchorRef, onClose, values, onSelect }: MenuProps<T>) => {
	const [closing, setClosing] = useState(false)

	return (
		<Menu closing={closing} anchorRef={anchorRef} placement="bottom" offset={[0, 2]} onClose={onClose}>
			{values.map(({ name, value }) => (
				<MenuItem
					key={value}
					text={name}
					onClick={() => {
						onSelect?.call(onSelect, value)
						setClosing(true)
					}}
				/>
			))}
		</Menu>
	)
}
