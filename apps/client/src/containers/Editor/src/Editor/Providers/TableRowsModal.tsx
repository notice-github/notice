import React, { ReactNode, useContext, useState } from 'react'

interface TableRowsModalContextType {
	opened: boolean
	setOpened: (value: boolean) => void
	activeIndex: number
	setActiveIndex: (value: number) => void
}

const TableRowsModalContext = React.createContext<TableRowsModalContextType | null>(null)

interface Props {
	children: ReactNode
}

export const TableRowsModalProvider = ({ children }: Props) => {
	const [opened, setOpened] = useState<boolean>(false)
	const [activeIndex, setActiveIndex] = useState<number>(0)

	const value = {
		opened,
		setOpened,
		activeIndex,
		setActiveIndex,
	}
	return <TableRowsModalContext.Provider value={value}>{children}</TableRowsModalContext.Provider>
}

export const useTableRowsModalState = (): TableRowsModalContextType => {
	const context = useContext(TableRowsModalContext)

	if (context === null) {
		throw new Error(
			`Received null while calling useContext(AddProjectModalContext), did you forget to put the provider ?`
		)
	}

	return context
}
