import { useState } from 'react'
import { MenuItem } from '../Menu/MenuItem'

import { darken } from 'polished'
import styled, { useTheme } from 'styled-components'

import { ChevronIcon } from '../../icons/ChevronIcon'
import { Menu } from '../Menu'
import { Show } from '../Show'

interface Props {
	values: string[]
	currentValue: string
	displayName: (value: string) => string
	displayIcon?: (value: string) => React.ReactElement
	onUpdate?: (value: string) => any
}

export const TypeSelector = ({ values, currentValue, displayName, displayIcon, onUpdate }: Props) => {
	const theme = useTheme()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLButtonElement | null>(null)

	return (
		<>
			<Button ref={setRef} onClick={() => setMenuOpened(true)}>
				{displayIcon && displayIcon(currentValue)}
				{displayName(currentValue)}
				<ChevronIcon color={theme.colors.textDark} size={14} style={{ transform: 'rotate(90deg)' }} />
			</Button>
			<Show when={menuOpened}>
				<DropdownMenu
					values={values}
					displayName={displayName}
					displayIcon={displayIcon}
					anchorRef={ref}
					onSelect={(value) => {
						onUpdate?.call(onUpdate, value)
					}}
					onClose={() => setMenuOpened(false)}
				/>
			</Show>
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

interface MenuProps<T> extends Pick<Props, 'values' | 'displayName' | 'displayIcon'> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	onSelect?: (value: string) => any
}

const DropdownMenu = <T extends HTMLElement>({
	anchorRef,
	onClose,
	values,
	displayName,
	displayIcon,
	onSelect,
}: MenuProps<T>) => {
	const [closing, setClosing] = useState(false)

	return (
		<Menu closing={closing} anchorRef={anchorRef} placement="bottom" offset={[0, 2]} onClose={onClose}>
			{values.map((value) => (
				<MenuItem
					key={value}
					icon={displayIcon?.call(displayIcon, value)}
					text={displayName(value)}
					onClick={() => {
						onSelect?.call(onSelect, value)
						setClosing(true)
					}}
				/>
			))}
		</Menu>
	)
}
