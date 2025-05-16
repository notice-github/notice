import { useLayoutEffect, useState } from 'react'

/**
 * Tells if components are hovered or not, pass it an array of refs and it returns an array of booleans.
 *
 * @example
 * 	const isHovered = useIsHovered([parentRef, childRef]).some(Boolean)

 *
 * TODO: combine this hook with a version that takes a single ref. Use function overloading.
 */
export const useIsHovered = (refs: Array<HTMLElement | null>): boolean[] => {
	// we assume the mouse is not inside when the component mounts (it might be false)

	// TODO: useMap to simplify state updates
	const [isHoveredByRefs, setIsHoveredByRefs] = useState(new Map<HTMLElement, boolean>())

	useLayoutEffect(() => {
		const mouseEnterListeners = new Map(
			refs.map((ref) => [
				ref,
				() => {
					if (ref === null) return
					setIsHoveredByRefs(new Map<HTMLElement, boolean>(isHoveredByRefs.set(ref, true)))
				},
			])
		)
		const mouseLeaveListeners = new Map(
			refs.map((ref) => [
				ref,
				() => {
					if (ref === null) return
					setIsHoveredByRefs(new Map<HTMLElement, boolean>(isHoveredByRefs.set(ref, false)))
				},
			])
		)

		for (const i in refs) {
			const ref = refs[i]
			if (ref === null) {
				continue
			}
			ref.addEventListener('mouseenter', mouseEnterListeners.get(ref)!)
			ref.addEventListener('mouseleave', mouseLeaveListeners.get(ref)!)

			const isHovered = ref.matches(':hover')
			if (isHovered !== isHoveredByRefs.get(ref)) {
				setIsHoveredByRefs(new Map<HTMLElement, boolean>(isHoveredByRefs.set(ref, isHovered)))
			}
		}
		return () => {
			for (const i in refs) {
				const ref = refs[i]
				if (ref === null) {
					continue
				}
				ref.removeEventListener('mouseenter', mouseEnterListeners.get(ref)!)
				ref.removeEventListener('mouseleave', mouseLeaveListeners.get(ref)!)
			}
		}
	}, [...refs])

	return refs.map((ref) => (ref ? isHoveredByRefs.get(ref) || false : false))
}
