import { useEffect } from 'react'

export const useLostSavingConfirmation = (busy: boolean) => {
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!busy) return
			const confirmationMessage = 'Changes that you made may not be saved.'
			;(e || window.event).returnValue = confirmationMessage // Gecko + IE
			return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [busy])
}
