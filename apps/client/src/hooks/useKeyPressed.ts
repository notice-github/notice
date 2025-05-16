import { useEffect } from 'react'

interface Options {
	ctrl?: boolean
	meta?: boolean
	shift?: boolean
}

export const useOnKeyPressed = (keyCode: string, callback: () => void, options: Options = {}): void => {
	return useEffect(() => {
		const callbackHandler = (e: KeyboardEvent) => {
			if (
				keyCode.toLowerCase() === e.key?.toLowerCase() &&
				(options.meta === true ? e.metaKey : true) &&
				(options.ctrl === true ? e.ctrlKey : true) &&
				(options.shift === true ? e.shiftKey : true)
			) {
				e.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', callbackHandler)
		
		return () => window.removeEventListener('keydown', callbackHandler)
	}, [keyCode])
}
