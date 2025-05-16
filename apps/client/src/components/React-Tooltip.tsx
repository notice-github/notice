import { ITooltip, Tooltip } from 'react-tooltip'
import { useTheme } from 'styled-components'

interface Props extends ITooltip {}

export const ReactTooltip = ({ children, anchorSelect }: Props) => {
	const theme = useTheme()
	return (
		<Tooltip style={{ backgroundColor: theme.colors.dark }} anchorSelect={anchorSelect}>
			{children}
		</Tooltip>
	)
}
