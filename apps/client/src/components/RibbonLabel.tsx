import { ReactNode } from 'react'
import styled from 'styled-components'

export const RibbonLabel = ({ children }: { children: ReactNode }) => {
	return <AbsoluteDiv>{children}</AbsoluteDiv>
}

const AbsoluteDiv = styled.div`
  position: absolute;
  inset: 3px calc(-1*10px) auto auto;
  padding: 0 10px 10px calc(10px + 15px);
  clip-path:
    polygon(0 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,
      calc(100% - 10px) calc(100% - 10px),0 calc(100% - 10px),
      15px calc(50% - 10px/2));
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  box-shadow: 0 calc(-1*10px) 0 inset #0005;
`
