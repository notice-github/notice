export namespace NSystem {
	/**
	 * Sleeps for a given number of milliseconds.
	 *
	 * @param ms - The number of milliseconds to sleep.
	 * @returns A Promise that resolves after the specified time has elapsed.
	 */
	export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
}
