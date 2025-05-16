import { IconProps } from '.'

export const ArrowIcon = ({ size = 16, color = 'white' }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 22 22" fill="none">
			<path
				d="M15 7V4L18 1L19 3L21 4L18 7H15ZM15 7L11 10.9999M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1M16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11C6 8.23858 8.23858 6 11 6"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
