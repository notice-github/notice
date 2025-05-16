import { IconProps } from '.'

export const Cross = ({ size = 16, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 16 16" style={style}>
			<line x1="0" y1="16" x2="16" y2="0" strokeWidth="2" stroke={color} />
			<line x1="0" y1="0" x2="16" y2="16" strokeWidth="2" stroke={color} />
		</svg>
	)
}
