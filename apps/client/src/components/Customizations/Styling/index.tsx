import styled from 'styled-components'

import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { useOnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { Row } from '../../Flex'
import { Show } from '../../Show'
import { Switch } from '../../Switch'
import { CustomizationExpandableSection } from '../CustomizationExpandableSection'
import { DEFAULT_STYLE_VALUES } from '../data'
import { StylingValueSelector } from './StylingValueSelector'

export const CustomizationStyling = () => {
	const [onPropertyChange] = useOnPropertyChange()
	const [project] = useCurrentProject()

	function filterObjectWithValues(value: string) {
		return Object.fromEntries(
			Object.entries(DEFAULT_STYLE_VALUES).filter(
				([, property]) => property.category === value && (property as any).isDerived !== true
			)
		)
	}

	const cssCatagories = Object.entries(DEFAULT_STYLE_VALUES)
		.map(([key, value]) => value.category)
		.filter((item, index, array) => array.indexOf(item) === index)

	return (
		<FlexColumn>
			{cssCatagories.map((value) => {
				return (
					<CustomizationExpandableSection key={value} title={value} noToggle>
						{Object.keys(filterObjectWithValues(value)).map((key) => {
							const styleValue = filterObjectWithValues(value)[key]

							const serverValue = project?.[styleValue.type === 'color-selector' ? 'colors' : 'preferences']?.[
								key
							] as string

							return (
								<InColumn key={key}>
									<StylesOptionRow>
										<InColumn>
											{styleValue.name}
											{(styleValue as Record<string, string>).description !== undefined && (
												<Description dangerouslySetInnerHTML={{ __html: (styleValue as any).description }} />
											)}
										</InColumn>
										<StylingValueSelector
											propertyName={key}
											serverValue={serverValue}
											onPropertyChange={onPropertyChange}
											type={styleValue.type}
											cssPropertyName={styleValue.CSSPropertyName}
											defaultValue={styleValue.defaultValue}
										/>
									</StylesOptionRow>
								</InColumn>
							)
						})}
						<Show when={value === 'Colors'}>
							<Container>
								<Row justify="space-between" align="center" gap={8}>
									<InColumn>
										<Title>Default to dark theme</Title>
										<Description>By selecting this option, your default theme will be dark mode.</Description>
									</InColumn>
									<Switch
										onChange={(value) => onPropertyChange('preferences', 'defaultToDarkMode', value)}
										value={project?.preferences?.defaultToDarkMode ?? false}
										size="sm"
									/>
								</Row>

								<Row justify="space-between" align="center" gap={8}>
									<InColumn>
										<Title>Auto detect dark theme</Title>
										<Description>
											Auto detects your website's current mode and automatically adjusts the project's theme to match
											it.
										</Description>
									</InColumn>
									<Switch
										onChange={(value) => onPropertyChange('preferences', 'autoDetectDarkMode', value)}
										value={project?.preferences?.autoDetectDarkMode ?? false}
										size="sm"
									/>
								</Row>
							</Container>
						</Show>
					</CustomizationExpandableSection>
				)
			})}
		</FlexColumn>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	padding: 24px;
	box-sizing: border-box;
	height: calc(100vh - ${({ theme }) => theme.modalMargin} - 85px * 2);
	overflow: auto;
`
const InColumn = styled.div`
	display: flex;
	flex: 1 1 100%;
	flex-direction: column;
	gap: 8px;
`

const StylesOptionRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 0;
	gap: 6px;
`

const Description = styled.p`
	margin-bottom: 8px;
	padding-left: 2px;
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin: 16px 0 8px 0;
`

const Title = styled.h4`
	padding-left: 2px;
`
