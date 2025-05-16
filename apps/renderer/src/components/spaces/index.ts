import { BOTTOM_SPACE } from './bottom.space'
import { HEADER_SPACE } from './header.space'
import { LEFT_SPACE } from './left.space'
import { RIGHT_SPACE } from './right.space'
import { TOP_SPACE } from './top.space'

export const SPACES = {
	[BOTTOM_SPACE.NAME]: BOTTOM_SPACE,
	[HEADER_SPACE.NAME]: HEADER_SPACE,
	[LEFT_SPACE.NAME]: LEFT_SPACE,
	[RIGHT_SPACE.NAME]: RIGHT_SPACE,
	[TOP_SPACE.NAME]: TOP_SPACE,
}
export type SPACES = typeof SPACES
