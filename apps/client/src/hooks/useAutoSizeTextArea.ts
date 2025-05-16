import { useEffect } from 'react'

/**
 * Custom hook that automatically resizes a textarea based on its content.
 *
 * @param textAreaRef - The reference to the textarea element.
 * @param value - The current value of the textarea.
 *
 * @example
 * const textAreaRef = useRef<HTMLTextAreaElement>(null)
 * const [value, setValue] = useState('')
 * useAutoSizeTextArea(textAreaRef, value) // automatically resizes the textarea
 */

const useAutoSizeTextArea = (textAreaRef: HTMLTextAreaElement | null, value: string) => {
	useEffect(() => {
		if (textAreaRef) {
			// We need to reset the height momentarily to get the correct scrollHeight for the textarea
			textAreaRef.style.height = '0px'
			const scrollHeight = textAreaRef.scrollHeight

			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will product an incorrect value.
			textAreaRef.style.height = scrollHeight + 'px'
		}
	}, [textAreaRef, value])
}

export default useAutoSizeTextArea
