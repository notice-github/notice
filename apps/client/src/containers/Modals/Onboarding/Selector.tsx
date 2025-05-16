import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Row } from '../../../components/Flex'
import { Menu } from '../../../components/Menu'
import { MenuItem } from '../../../components/Menu/MenuItem'
import { Show } from '../../../components/Show'
import { ChevronIcon } from '../../../icons/ChevronIcon'

interface Props {
	values: Record<string, string>[]
	defaultValue: string
	currentValue: string
	displayName: (value: string) => string
	displayIcon?: (value: string) => React.ReactElement
	onUpdate?: (value: string) => void
	onClick?: (value: string) => void
}

export const Selector = ({
	values,
	currentValue,
	displayName,
	displayIcon,
	onUpdate,
	defaultValue,
	onClick,
}: Props) => {
	const theme = useTheme()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLButtonElement | null>(null)

	return (
		<>
			<Button
				ref={setRef}
				onClick={() => {
					onClick?.call(onClick, ''), setMenuOpened(true)
				}}
			>
				<Row gap={3} align="center" justify="center">
					<span>{displayIcon && currentValue !== '' && displayIcon(currentValue || defaultValue)} </span>
					<span>
						{displayName(currentValue || defaultValue) === ''
							? 'Select a value'
							: displayName(currentValue || defaultValue)}
					</span>
				</Row>
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
	justify-content: space-between;
	padding: 11px 12px;

	border: none;
	outline-style: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	border: 1px solid ${({ theme }) => theme.colors.border};

	background-color: ${({ theme }) => theme.colors.white};

	span {
		color: ${({ theme }) => theme.colors.textDark};
		font-weight: 500;
		font-size: 14px;
	}

	white-space: nowrap;

	cursor: pointer;
	width: 100%;

	&:focus-within {
		border: 1px solid ${({ theme }) => theme.colors.primary};
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
		<Menu
			minWidth="266px"
			closing={closing}
			anchorRef={anchorRef}
			placement="top-start"
			offset={[0, 2]}
			onClose={onClose}
		>
			{values.map((value) => (
				<MenuItem
					key={value.name}
					icon={<IconWrapper>{value.icon}</IconWrapper>}
					text={displayName(value.name)}
					onClick={() => {
						onSelect?.call(onSelect, value.value)
						setClosing(true)
					}}
				/>
			))}
		</Menu>
	)
}

export const IconWrapper = styled.div`
	width: 22px;
	height: 16px;
	border-radius: 3px;

	display: flex;
	justify-content: center;
	align-items: center;
`
