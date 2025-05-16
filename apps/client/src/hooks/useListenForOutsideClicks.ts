import { useEffect } from 'react'

/**
 * Utility to listen for clicks outside of a list of refs.
 *
 * @example
 * useListenForOutsideClicks([ref1, ref2], () => {
 *   console.log('clicked outside of ref1 and ref2');
 * });
 */
export const useListenForOutsideClicks = (refs: (HTMLElement | null)[], onClickOutside: () => void, active = true) => {
	useEffect(() => {
		const callBack = (event: MouseEvent | TouchEvent) => {
			if (!active) return
			const clickedOutside = !refs.some((ref) => {
				if (!ref?.contains || !event.target) return false
				return ref.contains(event.target as Node)
			})
			if (clickedOutside) {
				onClickOutside()
			}
		}
		document.addEventListener('mousedown', callBack)
		document.addEventListener('touchstart', callBack)

		return () => {
			document.removeEventListener('mousedown', callBack)
			document.removeEventListener('touchstart', callBack)
		}
	}, [refs, active])
}
