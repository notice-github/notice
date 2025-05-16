import React from 'react'
import { CustomText } from '../types'

export const useHorizontalScrollShadow = (ref: React.RefObject<HTMLElement>, content: Array<CustomText[]>) => {
	const [showStart, setShowStart] = React.useState(false)
	const [showEnd, setShowEnd] = React.useState(false)

	React.useEffect(() => {
		const onScroll = () => {
			const { scrollWidth = 0, scrollLeft = 0, offsetWidth = 0 } = ref.current || {}
			setShowStart(scrollLeft > 0)
			setShowEnd(scrollLeft + offsetWidth < scrollWidth)
		}
		onScroll()
		const node = ref.current
		node?.addEventListener('scroll', onScroll)
		return () => {
			node?.removeEventListener('scroll', onScroll)
		}
	}, [content?.length])

	return [showStart, showEnd]
}
