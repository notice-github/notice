import { IconProps } from '.'

export const EmailIcon = ({ size = 24, color }: IconProps) => {
	return (
		<svg width={size} height={size} viewBox="0 0 64 64">
			<style>{'.st1{opacity:.2}.st2{fill:#231f20}.st3{fill:#e0e0d1}'}</style>
			<g id="Layer_1">
				<circle cx="32" cy="32" r="32" fill="#77b3d4" />
				<g className="st1">
					<path
						d="M52 44c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v20z"
						className="st2"
					/>
				</g>
				<path
					d="M52 42c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4V22c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v20z"
					className="st3"
				/>
				<g className="st1">
					<path
						d="M35.5 30.2c-1.9-2.1-5.1-2.1-7 0L13 43.2c-.2.2-.3.4-.5.6.7 1.3 2 2.2 3.4 2.2h32c1.5 0 2.7-.9 3.4-2.2-.1-.2-.3-.4-.5-.6l-15.3-13z"
						className="st2"
					/>
				</g>
				<path
					d="M35.5 32c-1.9-1.9-5.1-1.9-7 0L13 43.5l-.5.5c.7 1.2 2 1.9 3.4 1.9h32c1.5 0 2.7-.8 3.4-1.9-.1-.2-.3-.3-.5-.5L35.5 32z"
					className="st3"
				/>
				<g className="st1">
					<path
						d="M12.6 20.2c.7-1.3 2-2.2 3.4-2.2h32c1.5 0 2.7.9 3.4 2.2-.1.2-.3.4-.5.6l-15.4 13c-1.9 2.1-5.1 2.1-7 0L12.6 20.2z"
						className="st2"
					/>
				</g>
				<path
					d="M28.5 32c1.9 1.9 5.1 1.9 7 0L51 20.5l.5-.5c-.7-1.2-2-1.9-3.4-1.9H16c-1.5 0-2.7.8-3.4 1.9.1.2.3.3.5.5L28.5 32z"
					fill="#fff"
				/>
			</g>
		</svg>
	)
}
