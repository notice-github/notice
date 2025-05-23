import { IconProps } from '.'

export const ArrowRight = ({ size = 24, color }: IconProps) => {
	return (
		<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
			<path
				fill={color}
				d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z"
			/>
		</svg>
	)
}
