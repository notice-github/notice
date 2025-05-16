import 'module-alias/register'

import { NEnv, NTime } from '@notice-app/tools'
import { BrowserMiddleware } from '@root/middlewares/browser.middleware'
import { Logger, Server } from 'typerestjs'

const server = new Server({
	trustProxy: NEnv.NODE_ENV === 'production',
	maxParamLength: 256,
})

// Fake modification to trigger the CI/CD pipeline

//-------------//
// Loki Logger //
//-------------//
Logger.use((level, tag, msg, metadata) => {
	if (process.env.STAGE !== 'production' || level === 'debug') return

	fetch(`${process.env.LOKI_URL}/push`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(process.env.LOKI_USER + ':' + process.env.LOKI_PWD).toString('base64')}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			streams: [
				{
					stream: { from: 'renderer', level, tag, ...(metadata ?? {}) },
					values: [[`${Date.now() * 1e6}`, `[${tag.toUpperCase()}] ${msg}`]],
				},
			],
		}),
	})
})

//------//
// CORS //
//------//
server.enable('cors', {
	origin: '*',
})

//--------//
// Cookie //
//--------//
server.enable('cookie')

//--------------------//
// Global Middlewares //
//--------------------//
server.use(BrowserMiddleware.colorScheme())
server.use(BrowserMiddleware.language())
server.use(BrowserMiddleware.integration())

server.on('ready', () => {
	NTime.init('utc')
})

server.start()
