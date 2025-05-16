// import styled from 'styled-components'
// import { DEFAULT_STYLE_VALUES } from '../../../components/Customizations/data'
// import { Row } from '../../../components/Flex'
// import { FontSelector } from '../../../components/Selectors/FontSelector'
// import { optionsFormattedFonts } from '../../../data/fonts'
// import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
// import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
// import { Colors } from './Colors'
// import { Headings } from './Headings'
// import { Spacing } from './Spacing'
// import { Text } from './Text'

// export const SubHeader = () => {
// 	const [onPropertyChange] = useOnPropertyChange()
// 	const [project] = useCurrentProject()
// 	const { fontFamily } = project?.preferences || {}
// 	return (
// 		<Wrapper>
// 			<Row gap={16} height="100%">
// 				<Item>
// 					<Colors onPropertyChange={onPropertyChange} />
// 				</Item>
// 				<Item>
// 					<FontSelector
// 						defaultValue={DEFAULT_STYLE_VALUES.fontFamilyName.defaultValue}
// 						values={optionsFormattedFonts}
// 						onUpdate={(value) => onPropertyChange('preferences', 'fontFamilyName', value)}
// 						currentValue={fontFamily}
// 						displayName={(value) => value}
// 					/>{' '}
// 				</Item>

// 				<Item>
// 					<Spacing onPropertyChange={onPropertyChange} />
// 				</Item>
// 				<Item>
// 					<Headings onPropertyChange={onPropertyChange} />
// 				</Item>
// 				<Item>
// 					<Text onPropertyChange={onPropertyChange} />
// 				</Item>
// 			</Row>
// 		</Wrapper>
// 	)
// }

// const Wrapper = styled.div`
// 	height: 100%;
// 	padding: 0 16px;
// `
// const Item = styled.div`
// 	width: fit-content;
// 	padding-right: 18px;
// 	border-right: 1px solid ${({ theme }) => theme.colors.border};

// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// `
