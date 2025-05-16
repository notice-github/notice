import { useState } from 'react'
import styled from 'styled-components'
import { Show } from '../Show'

import { SimpleInput } from '../SimpleInput'

interface Props extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'onBlur'> {
	title: string
	description?: string
	initialValue: string
	loader?: boolean
	onUpdate?: (value: string) => any
}

export const SettingInput = ({ title, description, initialValue, onUpdate, ...props }: Props) => {
	const [value, setValue] = useState(initialValue)

	return (
		<Container>
			<Title>{title}</Title>
			<Show when={description != null}>
				<Description>{description}</Description>
			</Show>
			<SimpleInput
				value={value}
				onChange={(value) => setValue(value)}
				style={{ marginTop: '6px' }}
				onBlur={() => {
					if (onUpdate == null || value === initialValue) return
					onUpdate(value)
				}}
				{...props}
			/>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
`

const Title = styled.h3`
	font-size: 17px;
	font-weight: 500;
	margin-left: 2px;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textLightGrey};
	font-size: 13px;
`
