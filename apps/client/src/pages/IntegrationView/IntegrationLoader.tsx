import styled from 'styled-components'
import { Loader } from '../../components/Loader'

export const IntegrationLoader = () => {
	return (
		<WrapperLoader>
			<Loader size={36} />
		</WrapperLoader>
	)
}

const WrapperLoader = styled.div`
	margin: auto;
	width: 100%;
	margin-top: 200px;
	text-align: center;
`
