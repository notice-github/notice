import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { LogoSection } from '../General/LogoSection'
import { ContactFormSection } from './ContactFormSection'
import { TitleSection } from './TitleSection'

interface Props {
	type: string
	onPropertyChange: OnPropertyChange
}

export const LayoutChildrenTypeSelector = ({ type, onPropertyChange }: Props) => {
	switch (type) {
		case 'title-input':
			return <TitleSection onPropertyChange={onPropertyChange} />
		case 'logo-selector':
			return <LogoSection onPropertyChange={onPropertyChange} />
		case 'contact-email-input':
			return <ContactFormSection onPropertyChange={onPropertyChange} />

		default:
			return <></>
	}
}
