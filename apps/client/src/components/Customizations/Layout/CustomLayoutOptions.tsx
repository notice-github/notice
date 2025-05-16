import styled from 'styled-components'
import { useCurrentProject } from '../../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../../hooks/bms/project/useOnPropertyChange'
import { CustomizationExpandableSection } from '../CustomizationExpandableSection'
import { CustomizationSection } from '../CustomizationSection'
import { DEFAULT_LAYOUT } from '../data'
import { LayoutChildrenTypeSelector } from './LayoutChildrenTypeSelector'
import { LayoutDescriptions } from './LayoutDescriptions'

interface Props {
	onPropertyChange: OnPropertyChange
}

export const CustomLayoutOptions = ({ onPropertyChange }: Props) => {
	const layoutArray = Object.values(DEFAULT_LAYOUT)
	const [project] = useCurrentProject()

	const getObjectToUpdate = (value: boolean, space: string, element: string) => {
		return value && !project?.layout?.[space]?.show
			? {
					show: true,
					[element]: { show: value },
			  }
			: { [element]: { show: value } }
	}

	return (
		<>
			{layoutArray.map((spaces, spaceIndex) => {
				const elementsArray = Object.values(spaces.elements)
				const spacesKeys = Object.keys(DEFAULT_LAYOUT)
				const isToggled = (project?.layout?.[spacesKeys[spaceIndex]]?.show as boolean) ?? spaces?.show

				return (
					<CustomizationExpandableSection
						key={spaces.name}
						title={spaces.name}
						toggled={isToggled ?? false}
						onToggleChange={(value) =>
							onPropertyChange('layout', spacesKeys[spaceIndex], {
								show: value,
							})
						}
						shouldBeHighlightedOnExpand={true}
						toggleSize="sm"
					>
						{elementsArray.map((element, elementIndex) => {
							const elementsKey = Object.keys(spaces.elements)[elementIndex]
							const isToggled = project?.layout?.[spacesKeys[spaceIndex]]?.[elementsKey]?.show ?? element?.show

							if ((element as Record<string, string | boolean>).children !== undefined) {
								return (
									<>
										<CustomizationExpandableSection
											key={`${spaces.name} - ${element.name}`}
											title={element.name}
											toggled={isToggled ?? false}
											onToggleChange={(value) => {
												const objectToUpdate = getObjectToUpdate(value, spacesKeys[spaceIndex], elementsKey)
												onPropertyChange('layout', spacesKeys[spaceIndex], objectToUpdate)
											}}
											toggleSize="sm"
										>
											{(element as Record<string, any>).children.map((child: Record<string, any>, index: number) => {
												return (
													<InColumn key={index}>
														<Title>{child.name}</Title>
														<LayoutDescriptions elementType={elementsKey} />{' '}
														<LayoutChildrenTypeSelector
															type={child.type}
															onPropertyChange={onPropertyChange}
														></LayoutChildrenTypeSelector>
													</InColumn>
												)
											})}
										</CustomizationExpandableSection>
									</>
								)
							} else {
								return (
									<CustomizationSection
										key={`${spaces.name} - ${element.name}`}
										title={element.name}
										description={<LayoutDescriptions elementType={elementsKey} />}
										toggled={isToggled ?? false}
										onToggleChange={(value) => {
											const objectToUpdate = getObjectToUpdate(value as boolean, spacesKeys[spaceIndex], elementsKey)
											onPropertyChange('layout', spacesKeys[spaceIndex], objectToUpdate)
										}}
										toggleSize="sm"
									></CustomizationSection>
								)
							}
						})}
					</CustomizationExpandableSection>
				)
			})}
		</>
	)
}

const InColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

const Title = styled.h4`
	padding-left: 2px;
`
