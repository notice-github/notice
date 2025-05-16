import { ReactNode, useEffect } from 'react'
import WebFont from 'webfontloader'
import { useCurrentProject } from '../hooks/bms/project/useCurrentProject'

interface WebFontLoaderProviderProps {
	children: ReactNode
}

/**
 * When mounted sets up a synchronization between the font family
 * name from project preferences and what fonts are available in
 * the browser using WebFont.load.
 */
export const WebFontLoaderProvider = ({ children }: WebFontLoaderProviderProps) => {
	const [project] = useCurrentProject()
	// TODO: DEFAULT_FONT global constant
	const fontFamilyName = project?.preferences?.fontFamilyName

	// When project chosen fontFamily changes, fetch it dynamically
	useEffect(() => {
		if (fontFamilyName) {
			WebFont.load({
				google: {
					families: [`${fontFamilyName}:300,400,500,700`],
				},
			})
		}
	}, [fontFamilyName])

	return <>{children}</>
}
