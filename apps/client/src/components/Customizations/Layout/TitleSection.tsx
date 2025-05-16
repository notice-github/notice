import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { SimpleInput } from '../../SimpleInput'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const TitleSection = ({ onPropertyChange }: Props) => {
	const [project] = useCurrentProject()
	const currentValue = project?.preferences?.projectTitle

	const [title, setTitle] = useState(currentValue ?? '')

	useEffect(() => {
		if (currentValue != null) setTitle(currentValue)
	}, [currentValue])

	return (
		<SimpleInput
			type="text"
			value={title}
			onChange={(value) => setTitle(value)}
			onBlur={(value) => {
				if (value === currentValue) return
				onPropertyChange('preferences', 'projectTitle', value)
			}}
			placeholder="Project Title"
		/>
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
