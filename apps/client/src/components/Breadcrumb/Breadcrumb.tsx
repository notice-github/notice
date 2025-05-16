import styled from 'styled-components'

import { useActivePages } from '../../hooks/bms/page/useActivePages'
import { BreadcrumbNode } from './BreadcrumbNode'

export const Breadcrumb = () => {
	const pages = useActivePages()

	return (
		<Container>
			{pages.map((page, index) => (
				<BreadcrumbNode key={page.id} page={page} index={index} />
			))}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	padding-bottom: 12px;
`
