import { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { CogIcon } from '../../../icons'
import { Show } from '../../../components/Show'
import { SettingsMenu } from '../../../containers/Menus/SettingsMenu'

export const SettingsButton = () => {
	const theme = useTheme()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)

	return (
		<>
			<Button ref={setRef} onClick={() => setMenuOpened(true)}>
				<CogIcon size={20} color={theme.colors.grey} />
			</Button>
			<Show when={menuOpened}>
				<SettingsMenu anchorRef={ref} onClose={() => setMenuOpened(false)}></SettingsMenu>
			</Show>
		</>
	)
}

const Button = styled.div`
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
