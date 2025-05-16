export const useLocalStorage = <T = unknown>(key: string, initialValue?: T) => {
	const item = window.localStorage.getItem(key)
	const value: T = item ? JSON.parse(item) : initialValue

	const setValue = (value: T) => {
		window.localStorage.setItem(key, JSON.stringify(value))
	}
	return [value, setValue] as const
}
