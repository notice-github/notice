import { BlockModel } from '@notice-app/models'
import { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import { queryClient } from '../../utils/query'
import { ArrowIcon } from '../../icons/Arrow.icon'

export const ContentScore = (props: { page: BlockModel.block }) => {
	const theme = useTheme()
	const data = queryClient.getQueryData<any>(['slate-page-value', props.page.id, undefined])

	const [countWord, countImages, countLink] = useMemo(() => {
		console.log('data has changed', data)
		return [countWordsRecursively(data), countImagesRecursively(data), countLinksRecursively(data)]
	}, [data])
	return (
		<Modal>
			<Title>
				<ArrowIcon size={20} color={theme.colors.textDark} />
				Content Score
			</Title>
			<Hint style={{ marginBottom: 32 }}>
				Content score is a measure of how well your page is optimized for SEO. Aim for a score of 100 to maximize your
				page's visibility on search engines.
			</Hint>
			<Metric title="Word count" current={countWord} target={1200} />
			<Metric title="Has pictures" current={countImages} target={1} />
			<Metric title="Link count" current={countLink} target={6} />
		</Modal>
	)
}

const Hint = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const Metric = (props: { title: string; current: number; target: number }) => {
	const percent = Math.floor((props.current / props.target > 1 ? 1 : props.current / props.target) * 100)

	const theme = useTheme()
	const color = percent < 25 ? theme.colors.error : percent < 75 ? theme.colors.warning : theme.colors.success

	return (
		<div>
			<InfoRow style={{ margin: '8px 0px 8px 0px' }}>
				<div>{props.title}</div>
				<div
					style={{
						color: color,
					}}
				>
					{props.current} / {props.target}
				</div>{' '}
				{/* text-red-600 */}
			</InfoRow>
			<ProgressBarContainer>
				<ProgressBar width={`${percent}%`} color={color} />
			</ProgressBarContainer>
		</div>
	)
}

function countRecursively(data: any, counter: (item: any) => number) {
	let linkCount = 0

	// Helper function to process each item recursively
	function processItem(item: any) {
		// Check if this item is a link
		if (item) {
			linkCount += counter(item)
		}

		// If this item has children, process each child
		if (item.children && item.children.length > 0) {
			item.children.forEach((child: any) => processItem(child))
		}
	}

	// Iterate over each item in the data
	data.forEach((item: any) => processItem(item))

	return linkCount
}
function countLinksRecursively(data: any) {
	return countRecursively(data, (item) => (item.link != null ? 1 : 0))
}
function countImagesRecursively(data: any) {
	return countRecursively(data, (item) => (item.type === 'image' ? 1 : 0))
}
function countWordsRecursively(data: any) {
	return countRecursively(data, (item) => (item.text != null ? item.text.split(/\s+/).filter(Boolean).length : 0))
}

const Title = styled.h1`
	display: flex;
	align-items: center;
	gap: 8px;
	font-style: normal;
	font-weight: 700;
	font-size: 26px !important;
	margin-bottom: 12px;
`

const Modal = styled.div`
	width: 540px;
	padding: 24px 24px 28px 24px;
	user-select: none;
	* {
		${({ theme }) => theme.fonts.regular};
		font-size: 14px;
	}
`

const InfoRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 24px; /* gap-6 */
`

const ProgressBarContainer = styled.div`
	height: 10px; /* h-2.5 */
	width: 100%;
	border-radius: 9999px; /* rounded-full */
	background-color: #e5e7eb; /* bg-gray-200 */
`

const ProgressBar = styled.div<{ color: string; width: string }>`
	height: 10px; /* h-2.5 */
	border-radius: 9999px; /* rounded-full */
	background-color: ${(props) => props.color};
	width: ${(props) => props.width};
`
