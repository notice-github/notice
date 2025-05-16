import styled from 'styled-components'
import Check from '../../../icons/Check'

const FeatureOptionSelector = ({ option }: { option: any }) => {
	switch (option) {
		case false:
			return <Wrapper> - </Wrapper>
		case true:
			return <Check />
		case 'unlimited':
			return <Wrapper> ∞ </Wrapper>
		default:
			return <Wrapper>{option}</Wrapper>
	}
}

const Wrapper = styled.div`
color: ${({ theme }) => theme.colors.primary};
font-size: 18px;
font-weight: 700;
`

export default FeatureOptionSelector
