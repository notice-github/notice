import { darken } from 'polished'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { Modals } from '../../../components/Modal'
import { AddButtonMenu } from '../../../containers/Menus/AddButtonMenu'
import { InviteIcon } from '../../../icons/InviteIcon'
import { LargePlusIcon } from '../../../icons/LargePlusIcon'
import { SettingsButton } from './SettingsButton'

export const Footer = () => {
	const theme = useTheme()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	return (
		<>
			<Container>
				<SettingsButton />
			</Container>
			{menuOpened && <AddButtonMenu anchorRef={ref} onClose={() => setMenuOpened(false)} />}
		</>
	)
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 24px 16px;
`

const AddButton = styled.div<{ active: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 360px;
	background-color: ${({ theme }) => theme.colors.primary};

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
	}

	svg {
		transform: ${({ active }) => (active ? 'rotate(45deg)' : undefined)};
		transition: transform 0.25s ease;
	}
`

const WorkspaceButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 360px;

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.hoverDark};
	}
`
