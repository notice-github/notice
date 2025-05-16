import { useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { Menu } from '../../components/Menu'
import { MenuItem } from '../../components/Menu/MenuItem'
import { MenuSeparator } from '../../components/Menu/MenuSeparator'
import { Modals } from '../../components/Modal'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useUser } from '../../hooks/api/useUser'
import { CommunityIcon, MegaphoneIcon } from '../../icons'
import { AccountIcon } from '../../icons/AccountIcon'
import { LeaveIcon } from '../../icons/LeaveIcon'
import { WorkspaceIcon } from '../../icons/WorkspaceIcon'
import { Pages } from '../../pages'
import { API } from '../../utils/query'
import { useT } from '../../hooks/useT'
import { BookIcon } from '../../icons/BookIcon'

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any
}

export const SettingsMenu = <T extends HTMLElement>({ anchorRef, onClose }: Props<T>) => {
	const [t] = useT()
	const navigate = useNavigate()
	const [closing, setClosing] = useState(false)
	const trackEvent = useTrackEvent()
	const user = useUser()

	const onSettings = (page: string) => () => {
		navigate(page)
		setClosing(true)
	}

	const onSignOut = async () => {
		await API.post('/auth/disconnect')
		window.location.href = '/signin'
		setClosing(true)
	}

	return (
		<Menu closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<MenuItem
				icon={<WorkspaceIcon size={20} />}
				text={t('Workspace Settings', 'workspaceSettings')}
				onClick={onSettings(Pages.SETTINGS_WORKSPACE)}
			/>
			<MenuItem
				icon={<AccountIcon size={20} />}
				text={t('Account Settings', 'accountSettings')}
				onClick={onSettings(Pages.SETTINGS_ACCOUNT)}
			/>
			<MenuSeparator />
			<MenuItem
				icon={<CommunityIcon size={20} />}
				text={t('Support & Community', 'supportAndCommunity')}
				onClick={() => {
					Modals.contactUs.open()
					setClosing(true)
				}}
			/>

			<MenuSeparator />
			<MenuItem icon={<LeaveIcon size={18} />} text={t('Sign Out', 'signOut')} onClick={onSignOut} />
		</Menu>
	)
}
