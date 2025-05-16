import { useNavigate } from 'react-router-dom'

import { ModalContainer, ModalProps } from '../../components/Modal/ModalContainer'
import { useSearchParams } from '../../hooks/useSearchParams'
import { Pages } from '../../pages'

interface Props extends Partial<ModalProps> {
	children?: React.ReactNode

	// paramsToUpdate updates the listed params in the url when closing the modal.
	// Why is it necessary to put it here?
	// 1) router.tsx does not have access to setParams.
	// 2) using the return statement in a top useEffect(..., []) for each page does not work
	// because react-router renders (and unmounts!) the page twice, maybe because: https://stackoverflow.com/questions/73624115/react-router-6-3-0-render-component-twice
	// TODO: Maybe another cleaner solution?
	paramsToUpdate?: { [key: string]: string }
}

export const PortalLayout = ({
	children,
	fullHeight = true,
	fullPage = false,
	disableClickOutside = false,
	doNotShowExit = false,
	paramsToUpdate,
	width,
}: Props) => {
	const navigate = useNavigate()
	const [, setParams] = useSearchParams()

	return (
		<ModalContainer
			opened={true}
			onClose={() => {
				paramsToUpdate && setParams(paramsToUpdate)

				navigate(Pages.EDITOR)
			}}
			fullHeight={fullHeight}
			fullPage={fullPage}
			disableClickOutside={disableClickOutside}
			doNotShowExit={doNotShowExit}
			width={width}
		>
			{children}
		</ModalContainer>
	)
}
