import ReactDOM from 'react-dom'

// TODO: replace by the re-usable portal we created somewhere?
interface PortalProps {
	children?: React.ReactNode
}

export const Portal = ({ children }: PortalProps) => {
	return typeof document === 'object' ? ReactDOM.createPortal(children, document.body) : null
}
