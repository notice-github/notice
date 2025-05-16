import { css } from '@root/system'

export const MIXINS = {
	'flex-centered': css`
		display: flex;
		justify-content: center;
		align-items: center;
	`,

	'flex-align-center': css`
		display: flex;
		align-items: center;
	`,

	'flex-align-start': css`
		display: flex;
		justify-content: center;
		align-items: flex-start;
	`,

	'flex-column': css`
		display: flex;
		flex-direction: column;
	`,

	'flex-row': css`
		display: flex;
		flex-direction: row;
	`,

	'flex-column-centered': css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	`,

	'flex-column-align-start': css`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	`,

	'flex-row-centered': css`
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	`,

	'flex-row-start': css`
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	`,

	'flex-row-end': css`
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	`,

	'flex-row-space-between': css`
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	`,

	'flex-spaced-between': css`
		display: flex;
		align-items: center;
		justify-content: space-between;
	`,

	'text-ellipsis': css`
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	`,
	'multiline-ellipsis': css`
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		text-overflow: ellipsis;
		white-space: initial;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	`,

	'hide-scrollbar': css`
		-ms-overflow-style: none;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
			width: 0;
		}
	`,

	'size-100': css`
		width: 100%;
		height: 100%;
	`,

	'size-auto': css`
		width: auto;
		height: auto;
	`,
}

export type MIXINS = typeof MIXINS
