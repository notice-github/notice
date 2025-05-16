export namespace NObjects {
	/**
	 * Recursively converts nested objects into a flattened object with dot-separated property names.
	 *
	 * @param obj - The input object to be converted.
	 * @returns The flattened object with dot-separated property names.
	 */
	export const dotify = (obj: any, parent?: any, res: any = {}) => {
		for (const key of Object.keys(obj)) {
			const propName = parent ? parent + '.' + key : key
			const value = obj[key]
			if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
				dotify(value, propName, res)
			} else {
				res[propName] = value
			}
		}
		return res
	}
}
