import { IconProps } from '.'

export const LockIcon = ({ size = 16, color, style }: IconProps) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			style={style}
		>
			<circle cx="12" cy="16" r="1" />
			<rect x="3" y="10" width="18" height="12" rx="2" />
			<path d="M7 10V7a5 5 0 0 1 10 0v3" />
		</svg>
	)
}
