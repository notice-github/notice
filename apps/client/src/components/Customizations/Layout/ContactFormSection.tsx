import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { SimpleInput } from '../../SimpleInput'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const ContactFormSection = ({ onPropertyChange }: Props) => {
	const [project] = useCurrentProject()
	const currentValue = project?.preferences?.contactFormEmail

	const [email, setEmail] = useState(currentValue ?? '')

	useEffect(() => {
		if (currentValue != null) setEmail(currentValue)
	}, [currentValue])

	return (
		<Container>
			<SimpleInput
				type="email"
				value={email}
				onChange={(value) => setEmail(value)}
				onBlur={(value) => {
					if (value === currentValue) return
					onPropertyChange('preferences', 'contactFormEmail', value)
				}}
				placeholder="E-Mail"
			/>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

const Title = styled.h4`
	padding-left: 2px;
`

const Description = styled.p`
	margin-bottom: 8px;
	padding-left: 2px;

	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`
