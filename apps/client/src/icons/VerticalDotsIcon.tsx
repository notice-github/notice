import { IconProps } from '.'

export const VerticalDotsIcon = ({ size = 24, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
			<path d="M0 0h24v24H0V0z" fill="none" />
			<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
		</svg>
	)
}
