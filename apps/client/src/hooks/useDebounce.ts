import { useEffect, useState } from 'react'

const useDebounce = <T>(value: T, delay = 300, debouncedCallback?: (value: T) => void, initialValue: T = value) => {
	const [debounced, setDebounced] = useState(initialValue)
	const [isDebouncing, setIsDebouncing] = useState(false)

	useEffect(() => {
		setIsDebouncing(true)
		const timeout = setTimeout(() => {
			setIsDebouncing(false)
			setDebounced(value)
			debouncedCallback?.(value)
		}, delay)
		return () => {
			clearTimeout(timeout)
			setIsDebouncing(false)
		}
	}, [value])

	return [debounced, isDebouncing] as const
}

export default useDebounce
