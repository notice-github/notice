import { IconProps } from '.'

export const DropdownIcon = ({ size = 24, color }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
			<path
				d="M7 15l5 5 5-5M7 9l5-5 5 5"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			></path>
		</svg>
	)
}
