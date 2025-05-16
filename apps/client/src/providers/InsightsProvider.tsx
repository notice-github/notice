import React, { ReactNode, useContext, useState } from 'react'
import { PeriodType, SearchPanelsType } from '../pages/Insights/type'

interface InsightsContextType {
	period: PeriodType
	setPeriod: (value: PeriodType) => void
	searchPanel: SearchPanelsType
	setSearchPanel: (value: SearchPanelsType) => void
}

const InsightsContext = React.createContext<InsightsContextType | null>(null)

interface Props {
	children: ReactNode
}

export const InsightsProvider = ({ children }: Props) => {
	const [period, setPeriod] = useState<PeriodType>('Month')
	const [searchPanel, setSearchPanel] = useState<SearchPanelsType>('searchedWords')

	const value = {
		period,
		setPeriod,
		searchPanel,
		setSearchPanel,
	}
	return <InsightsContext.Provider value={value}>{children}</InsightsContext.Provider>
}

export const useInsights = (): InsightsContextType => {
	const context = useContext(InsightsContext)

	if (context === null) {
		throw new Error(`Received null while calling useContext(InsightsContext), did you forget to put the provider ?`)
	}

	return context
}
