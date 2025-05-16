import styled from 'styled-components'

const IntegrationTitleBanner = ({ title, icon }: { title: string; icon: string }) => {
	return (
		<Width100>
			<Icon src={icon}></Icon>
			<Heading32>{title}</Heading32>
		</Width100>
	)
}

const Heading32 = styled.h3`
font-size: 28px;
line-height: 40px;
font-weight: 500;
`

const Width100 = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 8px;

height: 98px;
width: 100%;

border-radius: 8px;
 img {
    margin-left: 16px;
 }
`

const Icon = styled.img`
	width: 48px;
	height: 48px;
`

export default IntegrationTitleBanner
