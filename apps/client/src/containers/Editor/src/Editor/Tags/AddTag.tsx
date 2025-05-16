import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { capitalize, minimalize } from './helpers'
import { usePopper } from 'react-popper'
import { useListenForOutsideClicks } from '../hooks/useListenForOutsideClicks'
import { usePagesBlocks } from '../../../../../hooks/bms/page/usePages'
import { useCurrentProject } from '../../../../../hooks/bms/project/useCurrentProject'
import { useT } from '../../../../../hooks/useT'

interface Props {
	addTag: (tag: string) => void
}
export function AddTag({ addTag }: Props) {
	const [search, setSearch] = useState('')
	const [isInputFocused, setInputFocused] = useState(false)
	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [allTags, setAllTags] = useState<string[]>([])
	const options = {
		placement: 'bottom',
		strategy: 'fixed',
	}
	const { styles, attributes } = usePopper(referenceElement, popperElement, options)
	const [currentProject] = useCurrentProject()
	const pages = usePagesBlocks(currentProject?.id)
	const [t] = useT()

	useEffect(() => {
		try {
			// The alltags are computed only once for each render of the component
			setAllTags(
				Array.from(
					new Set(
						Array.from(pages)
							.map((page) => {
								return page[1].metadata.tags ?? []
							})
							.flat()
					)
				)
			)
		} catch (e) {
			console.error(e)
			console.error('Mapping other pages for metadata failed')
			setAllTags([])
		}
	}, [])

	const filteredResults = allTags.filter((tag: string) => {
		const miniSearch = minimalize(search)
		return tag.includes(miniSearch)
	})

	// close menu when user clicks outside of menu and reference element
	useListenForOutsideClicks([referenceElement, popperElement], () => setInputFocused(false), isInputFocused)

	return (
		<Container ref={setReferenceElement}>
			<Input
				onFocus={() => setInputFocused(true)}
				type="text"
				placeholder={t('Add a tag', 'addATag')}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						addTag(minimalize(search))
						setSearch('')
					}
				}}
			/>
			{isInputFocused && (
				<AllTagsContainer ref={setPopperElement} style={styles.popper} {...attributes.popper}>
					{filteredResults.map((tag) => (
						<ElementTag
							key={tag}
							onClick={() => {
								addTag(minimalize(tag))
								setInputFocused(false)
								setSearch('')
							}}
						>
							{capitalize(tag)}
						</ElementTag>
					))}
				</AllTagsContainer>
			)}
		</Container>
	)
}

const Container = styled.div`
	position: relative;

	display: flex;
	flex-direction: row;
	gap: 8px;
	width: 180px;
	align-items: center;
`
const Input = styled.input`
	border: none;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	margin-bottom: 8px;
	outline: none;
	padding: 8px 8px 0px 0px;
	font-size: 14px;
	width: 200px;
`

const AllTagsContainer = styled.div`
	background-color: white;
	padding: 0px;
	border-radius: 0px 0px 4px 4px;
	box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
	max-height: 240px;
	overflow: auto;
	font-size: 15px;
	width: 180px;
`

const ElementTag = styled.div`
	padding: 3px;
	padding: 4px 6px 4px 6px;

	cursor: pointer;
	:hover {
		background-color: ${({ theme }) => theme.colors.primary};
		color: white;
	}
`
