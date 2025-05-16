import { UseQueryResult } from '@tanstack/react-query'
import { Method } from 'axios'
import { timeSpan } from './utils'

export type MakeAxiosCallType = {
	url: string
	method: Method | undefined
	params?: Record<string, string | null | boolean | undefined>
}

export type PeriodType = (typeof timeSpan)[number]
export type SearchPanelsType = 'searchedWords' | 'unfoundedWords'
export type TrafficContentType = 'device' | 'browser' | 'os'

export type InsightGraphData = {
	time: string
	count: number
}

export type InsightsVisitsData = {
	visits: InsightGraphData[]
	browser: Record<string, number>
	country: Record<string, number>
	device: Record<string, number>
	os: Record<string, number>
}

export type InsightsSearchData = {
	word: string
	count: number
	lang: Array<string>
}

export type InsightsVisitsResponseType = {
	data: InsightsVisitsData
	success: boolean
}

export type InsightsSearchResponseType = {
	data: InsightsSearchData[]
	success: boolean
}

export type InsightsSearchType = {
	searchData: Array<InsightsSearchData>
	searchPanelType: string
	isVisible: boolean
	query: UseQueryResult<any, unknown>
}
