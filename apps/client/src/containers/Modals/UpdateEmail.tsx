import { useState } from 'react'
import styled from 'styled-components'
import { SettingInput } from '../../components/Settings/SettingInput'
import { useUser } from '../../hooks/api/useUser'

export const UpdateEmail = () => {
	const user = useUser()

	return (
		<Container>
			<Title>Update email address</Title>
			<Description>Enter a new email address and we'll send you a confirmation email.</Description>
			<br />
			<SettingInput
				title="New email"
				description={`Your current email address is ${user.email}`}
				initialValue=""
				onUpdate={(value) => {}}
				placeholder={user.email}
			/>
		</Container>
	)
}

const Container = styled.div`
	width: 400px;
	padding: 40px;
`

const Title = styled.h1`
	font-weight: 700;
	font-size: 26px;
	margin-bottom: 5px;
`

const Description = styled.p`
	font-size: 16px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`
