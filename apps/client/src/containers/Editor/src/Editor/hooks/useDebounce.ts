import { useEffect, useState } from 'react'

export const useDebounce = <T>(
	value: T,
	delay = 300,
	debouncedCallback?: (value: T) => void,
	initialValue: T = value
) => {
	const [debounced, setDebounced] = useState(initialValue)

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebounced(value)
			debouncedCallback?.(value)
		}, delay)
		return () => clearTimeout(timeout)
	}, [value])

	return debounced
}
