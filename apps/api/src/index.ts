import { MongoDB } from '@notice-app/mongodb'
import { Postgres } from '@notice-app/postgres'
import { NEnv, NTime } from '@notice-app/tools'
import dns from 'dns/promises'
import { Logger, Server } from 'typerestjs'

const server = new Server({
	connectionTimeout: 5 * 60_000,
	maxParamLength: 256,
	trustProxy: NEnv.NODE_ENV === 'production',
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
					stream: { from: 'api', level, tag, ...(metadata ?? {}) },
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
	origin: {
		development: /.*/,
		testing: /.*/,
		staging: /notice\-staging\.studio$/,
		production: /notice\.studio$/,
	}[NEnv.STAGE],
	maxAge: 3600,
	credentials: true,
})

//------------//
// Rate Limit //
//------------//
server.enable('rate-limit', {
	timeWindow: '1 minute',
	max: 120,
})

//--------//
// Cookie //
//--------//
server.enable('cookie')

//--------------//
// Before start //
//--------------//
server.on('ready', async () => {
	NTime.init('utc')
	dns.setServers(['1.1.1.1', '8.8.8.8'])

	if (NEnv.STAGE !== 'production') {
		await Postgres.init()
		await MongoDB.init()
	}
})

server.start()
