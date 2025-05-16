import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useTheme } from 'styled-components'

export const DEFAULT_TOAST = 'DEFAULT_TOAST'

export const GlobalToastContainer = () => {
	const theme = useTheme()

	return (
		<ToastContainer
			theme="light"
			position="top-right"
			containerId={DEFAULT_TOAST}
			style={{ zIndex: theme.zIndex.toast }}
			toastStyle={{ border: `1px solid ${theme.colors.borderLight}`, borderRadius: theme.borderRadius }}
		/>
	)
}
