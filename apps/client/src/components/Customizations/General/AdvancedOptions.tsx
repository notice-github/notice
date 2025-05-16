import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { LargePlusIcon } from '../../../icons/LargePlusIcon'
import { useT } from '../../../hooks/useT'

type Props = {
	children: ReactNode
}

export const AdvancedOptions = ({ children }: Props) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [t] = useT()
	return (
		<AccordionContainer>
			<AccordionHeader isExpanded={isExpanded} onClick={() => setIsExpanded((e) => !e)}>
				<h4>{t('Advanced Options', 'advancedOptions')}</h4>
				<IconContainer isExpanded={isExpanded}>
					<LargePlusIcon size={12} />
				</IconContainer>
			</AccordionHeader>
			<AccordionGridContainer isExpanded={isExpanded}>
				<AccordionContent>{children}</AccordionContent>
			</AccordionGridContainer>
		</AccordionContainer>
	)
}

const AccordionContainer = styled.div`
	width: 100%;
	box-sizing: border-box;
	margin: 8px 0;
`
const AccordionHeader = styled.div<{ isExpanded: boolean }>`
	box-sizing: border-box;
	padding: 8px;
	color: ${({ theme, isExpanded }) => (isExpanded ? theme.colors.primaryDark : theme.colors.textGrey)};
	cursor: pointer;
	transition: color 0.3s ease-in-out;

	display: flex;
	justify-content: space-between;
	align-items: center;

	svg path {
		fill: ${({ theme, isExpanded }) => (isExpanded ? theme.colors.primaryDark : theme.colors.textGrey)};
	}

	&:hover {
		color: ${({ theme }) => theme.colors.primaryDark};

		svg path {
			fill: ${({ theme }) => theme.colors.primaryDark};
		}
	}
`

const IconContainer = styled.div<{ isExpanded: boolean }>`
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
`
const AccordionGridContainer = styled.div<{ isExpanded: boolean }>`
	display: grid;
	grid-template-rows: ${({ isExpanded }) => (isExpanded ? '1fr' : '0fr')};
	transition: grid-template-rows 500ms;
	padding: 12px 12px;
`

const AccordionContent = styled.div`
	overflow: hidden;
`
