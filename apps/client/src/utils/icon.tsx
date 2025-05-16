export const renderIcon = (icon?: string) => {
	if (!icon) return <img width={16} height={16} src="/assets/svg/emojis/page.svg" />
	const [id] = icon.match(/^:([a-z]|\-)+:$/) ?? []
	if (id) return <img width={16} height={16} src={`/assets/svg/emojis/${id.slice(1, -1)}.svg`} />
	return icon
}
