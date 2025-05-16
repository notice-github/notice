import styled from 'styled-components'
import { useState } from 'react'
import { AddTag } from './AddTag'
import { Tag } from './Tag'
import { capitalize } from './helpers'

interface Props {
	tags: string[]
	setTags: (tags: string[]) => void
}
export function Tags({ tags, setTags }: Props) {
	const addTag = (tag: string) => {
		// if tag already exists, don't add it
		if (tags.find((t) => t === tag)) return

		setTags([...tags, tag])
	}

	const removeTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag))
	}

	return (
		<Container>
			<AddTag addTag={addTag} />

			<TagsContainer>
				{tags.map((tag) => (
					<Tag key={tag} name={capitalize(tag)} removeTag={removeTag} />
				))}
			</TagsContainer>
		</Container>
	)
}

const TagsContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 8px;
	flex-wrap: wrap;
`

const Container = styled.div`
	max-width: 500px;
`
