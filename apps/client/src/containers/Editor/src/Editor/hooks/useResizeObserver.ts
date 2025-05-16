import { RefObject, useEffect, useRef, useState } from 'react'

/*
useResizeObserver hook is used to observe changes to Element's size.
which accepts ref as a parameter and tracks the changes of the element ref

 @example
    const ref = useRef(null)
	const contentRect = useResizeObserver(ref);

*/

export interface ResizeObserverEntry {
	target: HTMLElement
	contentRect: DOMRectReadOnly
}

export function useResizeObserver(ref: RefObject<HTMLElement>) {
	const [contentRect, setContentRect] = useState({}) // store element sizes
	const resizeObserver = useRef<ResizeObserver | null>(null)

	// Start observing the element when the component is mounted
	useEffect(() => {
		if ('ResizeObserver' in window) {
			observe(ResizeObserver)
		} else {
			import('resize-observer-polyfill').then(observe) // use the polyfill to observe for old browsers
		}

		function observe(ResizeObserver: any) {
			resizeObserver.current = new ResizeObserver((entries: ResizeObserverEntry[]) => {
				const { width, height, right, left } = entries[0].contentRect
				setContentRect({ width, height, right, left })
			})
			if (ref.current) {
				resizeObserver.current!.observe(ref.current)
			} //
		}

		return disconnect // Cleanup the observer by unobserving all elements
	}, [ref])

	function disconnect() {
		if (resizeObserver.current) {
			resizeObserver.current.disconnect()
		}
	}

	return contentRect
}
