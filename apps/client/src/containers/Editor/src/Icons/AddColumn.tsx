import { IconProps } from '.'

export const AddColumn = ({ size = 18, color, style }: IconProps) => {
	return (
		<svg viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" width={size} height={size} style={style}>
			<g clipPath="url(#TableInsertColumn_svg__clip0_1373_8720)" fill="currentColor">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					fill={color}
					d="M2.75.9a2.6 2.6 0 00-2.6 2.6v9a2.6 2.6 0 002.6 2.6h5.5a.6.6 0 100-1.2h-.9V2.1h.9a.6.6 0 100-1.2h-5.5zm3.4 1.2h-3.4a1.4 1.4 0 00-1.4 1.4v9a1.4 1.4 0 001.4 1.4h3.4V2.1z"
				></path>
				<path
					fill={color}
					d="M12.5 4.9a.6.6 0 01.6.6v1.9H15a.6.6 0 110 1.2h-1.9v1.9a.6.6 0 11-1.2 0V8.6H10a.6.6 0 010-1.2h1.9V5.5a.6.6 0 01.6-.6zM9.9 1.5a.6.6 0 01.6-.6h1a1.6 1.6 0 011.6 1.6V3a.6.6 0 11-1.2 0v-.5a.4.4 0 00-.4-.4h-1a.6.6 0 01-.6-.6zM13.1 13a.6.6 0 00-1.2 0v.5a.4.4 0 01-.4.4h-1a.6.6 0 000 1.2h1a1.6 1.6 0 001.6-1.6V13z"
				></path>
			</g>
			<defs>
				<clipPath id="TableInsertColumn_svg__clip0_1373_8720">
					<path fill={color} d="M0 0h16v16H0z"></path>
				</clipPath>
			</defs>
		</svg>
	)
}
