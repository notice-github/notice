import { IconProps } from '.'

export const ArrowLeft = ({ size = 24, color }: IconProps) => {
	return (
		<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
			<path
				fill={color}
				d="M203.9 405.3c5.877 6.594 5.361 16.69-1.188 22.62c-6.562 5.906-16.69 5.375-22.59-1.188L36.1 266.7c-5.469-6.125-5.469-15.31 0-21.44l144-159.1c5.906-6.562 16.03-7.094 22.59-1.188c6.918 6.271 6.783 16.39 1.188 22.62L69.53 256L203.9 405.3z"
			/>
		</svg>
	)
}
