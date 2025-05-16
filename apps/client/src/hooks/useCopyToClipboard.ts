import { useState } from 'react'

const useCopyToClipboard = () => {
	const [isCopied, setIsCopied] = useState(false)

	async function copyTextToClipboard(text: string) {
		if ('clipboard' in navigator) {
			return await navigator.clipboard.writeText(text)
		} else {
			return document.execCommand('copy', true, text)
		}
	}

	// onClick handler function for the copy button
	const handleOnCopy = (textToCopy: string) => {
		// Asynchronously call copyTextToClipboard
		copyTextToClipboard(textToCopy)
			.then(() => {
				// If successful, update the isCopied state value
				setIsCopied(true)
				setTimeout(() => {
					setIsCopied(false)
				}, 2000)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return [isCopied, handleOnCopy] as const
}

export default useCopyToClipboard
