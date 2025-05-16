import styled from 'styled-components'

export const MenuSectionTitle = ({ text, name }: { text: string; name: string; subtype: 'SectionTitle' }) => {
	return (
		<SectionTitle tabIndex={-1} key={name}>
			{text}
		</SectionTitle>
	)
}

export const MenuSectionNoResult = ({ text, name }: { text: string; name: string; subtype: 'SectionNoResult' }) => {
	return (
		<SectionNoResults tabIndex={-1} key={name}>
			{text}
		</SectionNoResults>
	)
}

const SectionNoResults = styled.div`
	padding: 12px 12px 12px 12px;
	color: ${({ theme }) => theme.colors.textGrey};

`

const SectionTitle = styled.div`
	padding: 12px 16px 0px 16px;
	text-transform: uppercase;
	color: ${({ theme }) => theme.colors.textGrey};
	font-size: 11px;
	font-weight: 400;

`
