import { randomUUID } from 'crypto'
import { tmpdir } from 'os'
import puppeteer, { Browser, Page, ScreenshotOptions } from 'puppeteer-core'

export namespace BrowserService {
	export const newPage = async (browser: Browser, url: string) => {
		const page = await browser.newPage()

		await page.setViewport({ width: 1920, height: 1080 })

		await page.goto(url, {
			timeout: 15_000,
			waitUntil: 'domcontentloaded',
		})

		try {
			await page.waitForNetworkIdle({ idleTime: 250, timeout: 10_000 })
		} catch (_) {}

		return page
	}

	export const openSession = async (address: string, isDomain = true) => {
		const browser = await puppeteer.connect({
			browserWSEndpoint: `wss://${process.env.BD_USER}:${process.env.BD_PWD}@${process.env.BD_ENDPOINT}`,
		})

		const page = await newPage(browser, isDomain ? `https://${address}` : address)
		page.on('dialog', (e) => e.dismiss())

		return page
	}

	export const navigate = async (page: Page, url: string) => {
		await page.goto(url, {
			timeout: 5_000,
			waitUntil: 'domcontentloaded',
		})
		try {
			await page.waitForNetworkIdle({ idleTime: 200, timeout: 1_000 })
		} catch (_) {}
	}

	export const screenshot = async (page: Page, options?: Omit<ScreenshotOptions, 'encoding' | 'path' | 'type'>) => {
		const path = `${tmpdir()}/${randomUUID()}.png`

		await page.screenshot({
			...options,
			type: 'png',
			encoding: 'binary',
			path,
		})

		return path
	}

	export const closeSession = async (page: Page) => {
		await page.close()
	}
}
