import { createPortal } from 'react-dom'

interface Props {
	children?: React.ReactNode
}

export const Portal = ({ children }: Props) => {
	return createPortal(children, document.body)
}
