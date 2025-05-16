export const Show = ({ when, children }: { when: any; children: React.ReactNode }) => {
	if (!when) return <></>
	return <>{children}</>
}
