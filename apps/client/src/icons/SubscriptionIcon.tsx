import { IconProps } from '.'

export const SubscriptionIcon = ({ size = 24, color, style }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
			<circle cx="5.5" cy="15.5" r="1.5" />
			<path d="M19,3H5A5.006,5.006,0,0,0,0,8v8a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V8A5.006,5.006,0,0,0,19,3ZM5,5H19a3,3,0,0,1,3,3H2A3,3,0,0,1,5,5ZM19,19H5a3,3,0,0,1-3-3V10H22v6A3,3,0,0,1,19,19Z" />
		</svg>
	)
}
