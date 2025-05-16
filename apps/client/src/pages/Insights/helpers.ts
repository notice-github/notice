import { NEnv } from '@notice-app/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { MIXPANEL_PRODUCTION_PROJECT_TOKEN, MIXPANEL_STAGING_PROJECT_TOKEN } from '../../Constants'
import { InsightGraphData, PeriodType } from './type'

// mixpanel api key choose
export const getMixpanelProjectToken = (): string => {
	switch (NEnv.STAGE) {
		case 'development':
		case 'testing':
		case 'staging':
			return MIXPANEL_STAGING_PROJECT_TOKEN
		case 'production':
			return MIXPANEL_PRODUCTION_PROJECT_TOKEN
	}
}

dayjs.extend(utc) // extended the dayjs to use utc plugin

// count total visits for each period
export const getTotalViews = (analyticData: InsightGraphData[] | undefined) => {
	let initialValue = 0
	if (analyticData && analyticData.length) {
		analyticData?.forEach((element: InsightGraphData) => {
			initialValue += element.count
		})
	}
	return initialValue
}

// format to show on the x axis
export const getFormat = (period: PeriodType) => {
	if (period === 'Day') {
		return 'HH:mm'
	} else if (period === 'Week') {
		return 'DD/MMM'
	} else if (period === 'Month') {
		return 'DD/MMM'
	} else if (period === 'Year') {
		return 'MMM/YY'
	}
	return
}

export const getFormatFromIndex = (index: number) => {
	if (index === 0) {
		return 'HH:mm'
	} else if (index === 1) {
		return 'DD/MMM'
	} else if (index === 2) {
		return 'DD/MMM'
	} else if (index === 3) {
		return 'MMM/YY'
	}
	return
}
