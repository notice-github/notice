import { IconProps } from '.'

export const AudioIcon = ({ size = 30, color = '#3A85D0' }: IconProps) => {
	return (
		<svg
			style={{ width: size, height: size }}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 10L3 14M7.5 6L7.5 18M12 3V21M16.5 6V18M21 10V14"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
