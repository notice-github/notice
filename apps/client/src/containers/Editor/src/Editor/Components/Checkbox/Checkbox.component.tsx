import styled from 'styled-components'

export const Checkbox = (props: any) => {
	return <StyledInput type="checkbox" {...props} />
}

const StyledInput = styled.input`
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* For iOS < 15 */
  background-color: transparent;
  /* Not removed via appearance */
  margin: 0;
  cursor: pointer;
  font: inherit;
  color: ${({ theme }) => theme.colors.primary};
  width: 1.15em;
  height: 1.15em;
  border: 0.10em solid ${({ theme }) => theme.colors.primary};
  border-radius: 3px;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;

::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  transform: scale(0);
  transform-origin: bottom left;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em ${({ theme }) => theme.colors.primary};
  /* Windows High Contrast Mode */
  background-color: ${({ theme }) => theme.colors.primary};


}

:checked::before {
  transform: scale(1);
}

:focus {
  outline: none;
  outline-offset: none;
}

`
