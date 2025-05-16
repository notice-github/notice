export const timeSpan = ['Day', 'Week', 'Month', 'Year'] as const

/* Insights  utility function  */

export const isEven = (index: number) => {
	return index % 2 !== 0
}

export const isObjectEmpty = (obj: Record<string, number> | undefined) => {
	return obj && Object.values(obj).length === 0
}

export const getSumOfValues = (country: Record<string, number> | undefined): number | undefined => {
	return country && Object.values(country).reduce((a, b) => a + b, 0)
}

export const getPercentage = (partialValue: number, country: Record<string, number>) => {
	const totalValue = getSumOfValues(country)
	return totalValue && Math.round((partialValue * 100) / totalValue)
}

/* Insights Graph configs */

// export const getInsightsGraphData = (data: InsightGraphData[], format: string | undefined) => {
// 	return {
// 		datasets: [
// 			{
// 				fill: true,
// 				data: data?.map((visit: InsightGraphData) => {
// 					return {
// 						x: dayjs(visit.time).format(format),
// 						y: visit.count,
// 					}
// 				}),

// 				borderColor: '#FFC107',
// 				pointHitRadius: 40,
// 				pointBackgroundColor: '#FFC107',
// 				backgroundColor: (context: any) => {
// 					const chart = context.chart
// 					const { ctx, chartArea } = chart

// 					if (!chartArea) {
// 						// This case happens on initial chart load
// 						return
// 					}
// 					return getGraphGradientColor({ ctx, chartArea })
// 				},
// 			},
// 		],
// 	}
// }

export const getGraphGradientColor = ({ ctx, chartArea }: any) => {
	let width, height, gradient

	const chartWidth = chartArea.right - chartArea.left
	const chartHeight = chartArea.bottom - chartArea.top
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth
		height = chartHeight
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
		gradient.addColorStop(0, '#FFFFFF')
		gradient.addColorStop(1, ' #FFDF92')
	}

	return gradient
}

export const getInsightsGraphOptions = () => {
	return {
		type: 'line',
		responsive: true,
		maintainAspectRatio: false,
		layout: {
			padding: 20,
		},
		scales: {
			y: {
				ticks: {
					precision: 0,
					beginAtZero: true,
					maxTicksLimit: 8,
				},
				border: {
					display: false,
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				enabled: true,
				backgroundColor: 'white',
				bodyColor: 'black',
				titleColor: 'black',
				borderColor: '#ECECED',
				borderWidth: 1,
				callbacks: {
					title: () => 'Overview',
					label: function (data: any) {
						return ` ${data.formattedValue} visitors`
					},
				},
			},
		},
	}
}

/* Insights Donut chart configs */

export const convertObjToArr = (metadata: Record<string, number> | undefined) => {
	if (metadata) {
		const arr = []
		for (const key in metadata) {
			arr.push(Object.assign({ name: key, count: metadata[key] }))
		}

		return arr
	}
}

// create a container with legend items in flex box
export const getOrCreateLegendList = (id: string) => {
	const legendContainer = document.getElementById(id)
	let listContainer = legendContainer?.querySelector('div')

	if (!listContainer) {
		listContainer = document.createElement('div')
		listContainer.className = 'legend-container'
		listContainer.style.display = 'flex'
		listContainer.style.flexDirection = 'row'
		listContainer.style.columnGap = '12px'
		listContainer.style.margin = '40px'
		listContainer.style.justifyContent = 'center'
		listContainer.style.alignItems = 'center'
		listContainer.style.margin = '0'
		listContainer.style.padding = '0'
		listContainer.style.flexWrap = 'wrap'
		legendContainer?.appendChild(listContainer)
	}

	return listContainer
}

// add the legend item with name and color it represents the legend item in chart
const getLegendItem = (item: any, chart: any) => {
	const legendItem = document.createElement('div')
	legendItem.style.alignItems = 'center'
	legendItem.style.cursor = 'auto'
	legendItem.style.display = 'flex'
	legendItem.style.flexDirection = 'row'

	// Color box
	const boxSpan = document.createElement('span')
	boxSpan.style.background = item.fillStyle
	boxSpan.style.borderColor = item.strokeStyle
	boxSpan.style.borderWidth = item.lineWidth + 'px'
	boxSpan.style.borderRadius = '20px'
	boxSpan.style.display = 'inline-block'
	boxSpan.style.height = '15px'
	boxSpan.style.marginRight = '4px'
	boxSpan.style.width = '15px'

	// Text
	const textContainer = document.createElement('p')
	textContainer.style.color = item.fontColor
	textContainer.style.margin = '0'
	textContainer.style.padding = '0'
	textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

	const text = document.createTextNode(item.text)
	textContainer.appendChild(text)

	legendItem.appendChild(boxSpan)
	legendItem.appendChild(textContainer)

	return legendItem
}

// splice the legends and the remaining items to the div container
const getRemainingLegends = (legendContainer: HTMLDivElement, chart: any) => {
	const restOfTheLegend = document.createElement('div')
	restOfTheLegend.className = 'remaining-legends'
	restOfTheLegend.style.position = 'absolute'
	restOfTheLegend.style.display = 'flex'
	restOfTheLegend.style.flexDirection = 'column'
	restOfTheLegend.style.gap = '8px'
	restOfTheLegend.style.width = 'auto'
	restOfTheLegend.style.height = 'auto'

	restOfTheLegend.style.backgroundColor = 'white'
	restOfTheLegend.style.padding = '8px'
	restOfTheLegend.style.borderRadius = '4px'
	restOfTheLegend.style.border = '1px solid #ececed'
	restOfTheLegend.style.left = '200px'
	restOfTheLegend.style.bottom = '10px'

	const items = chart.options.plugins.legend.labels.generateLabels(chart)

	items.slice(2).forEach((item: any) => {
		const legendItem = getLegendItem(item, chart)
		restOfTheLegend.appendChild(legendItem)
	})
	legendContainer.appendChild(restOfTheLegend)
}

// add a button called show more on hover display the container with the remaining legend
const getShowMoreLegendButton = (legendContainer: HTMLDivElement, chart: any) => {
	const showMore = document.createElement('div')

	showMore.className = 'show-more'
	showMore.style.color = '#3a83cf'
	showMore.innerHTML = 'show more'
	showMore.style.cursor = 'pointer'
	showMore.onmouseenter = () => {
		getRemainingLegends(legendContainer, chart)
	}
	showMore.onmouseleave = () => {
		const element = document.getElementsByClassName('remaining-legends')[0]
		element.remove()
	}

	legendContainer.appendChild(showMore)
}

// custom html legend with show more button
export const getHtmlLegendPlugin = () => ({
	id: 'htmlLegend',
	afterUpdate(chart: any, args: any, options: any) {
		const legendContainer = getOrCreateLegendList(options.containerID)
		legendContainer.style.position = 'relative'
		// Remove old legend items
		while (legendContainer.firstChild) {
			legendContainer.firstChild.remove()
		}

		// Reuse the built-in legendItems generator
		const items = chart.options.plugins.legend.labels.generateLabels(chart)

		// add show more button if the legends are high
		if (items.length > 2) {
			items.slice(0, 2).forEach((item: any) => {
				const legendItem = getLegendItem(item, chart)
				legendContainer.appendChild(legendItem)
			})
			getShowMoreLegendButton(legendContainer, chart)
		} else {
			items.forEach((item: any) => {
				const legendItem = getLegendItem(item, chart)
				legendContainer.appendChild(legendItem)
			})
		}
	},
})

export const randomColorGenerator = () => {
	return '#' + (Math.random().toString(16) + '0000000').slice(2, 8)
}

export const poolColors = (length: number | undefined) => {
	if (!length) return []
	const figmaColors = [
		'#FFC107',
		'#F87872',
		'#65C985',
		'#4E80EE',
		'#FFDF92',
		'#607D8B',
		'#C4D78E',
		'#F2F0EC',
		'#589ED5',
		'#808080',
		'#DF613F',
		'#F1A66D',
	]

	for (let i = 0; i < length; i++) {
		while (length > figmaColors.length) {
			figmaColors.push(randomColorGenerator())
		}
	}
	return figmaColors
}

export const getChartsData = (desiredArrayOfData: Array<Record<string, number>> | undefined, labels: any) => ({
	labels,
	datasets: [
		{
			label: '# of Votes',
			data: desiredArrayOfData?.map((data) => data.count),
			backgroundColor: poolColors(desiredArrayOfData?.length),
			borderRadius: 4.5,
			borderJoin: 'round',
		},
	],
})

export const getChartsConfigOptions = (containerId: string) => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		htmlLegend: {
			// ID of the container to put the legend in
			containerID: containerId,
		},
		legend: {
			display: false,
		},

		elements: {
			arc: {
				borderWidth: 0,
			},
		},
		tooltip: {
			backgroundColor: 'white',
			bodyColor: 'black',
			titleColor: 'black',
			borderColor: '#ECECED',
			borderWidth: 1,
			callbacks: {
				title: function (data: any) {
					return data[0].label
				},
				label: function (data: any) {
					const values = data.dataset.data
					const accumulatedValues = values.reduce((acc: number, elem: number) => {
						return (acc += elem)
					}, 0)
					return ` ${data.formattedValue} (${Math.round((data.raw * 100) / accumulatedValues)}%)`
				},
			},
		},
	},
})
