import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relative from 'dayjs/plugin/relativeTime'

export namespace NTime {
	//---------------//
	// Private scope //
	//---------------//

	let _type: 'utc' | 'local'

	const _dayjs = (date?: string | number | Date | dayjs.Dayjs | null) => {
		if (_type === 'utc') return dayjs(date).utc()
		else return dayjs(date).local()
	}

	//--------------//
	// Public scope //
	//--------------//

	export const init = (type: typeof _type) => {
		_type = type
		dayjs.extend(utc)
		dayjs.extend(relative)
	}

	export const now = () => _dayjs().toDate()
	export const from = (date?: string | number | Date | dayjs.Dayjs | null) => _dayjs(date).toDate()

	export const $now = () => _dayjs()
	export const $from = (date?: string | number | Date | dayjs.Dayjs | null) => _dayjs(date)
}
