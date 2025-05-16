import { Notice } from '@notice-org/react'
import styled from 'styled-components'
import { Loader } from '../../components/Loader'

export function GoogleIndexationGuide() {
	return (
		<Container>
			<Notice page="seo-and-indexation-849l678227">
				<Loader />
			</Notice>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 24px;
	width: 700px;
	max-width: 100%;
	min-height: 700px;
	transition: 0.3s;
`
