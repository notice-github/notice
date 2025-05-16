type JSONValue = string | number | boolean | RegExp | EmbedServicesList | any

interface EmbedServicesList {
	[x: string]: JSONValue
}
export namespace NEmbeds {
	export const embedServicesList: EmbedServicesList = {
		airtable: {
			regex: /(https?:\/\/airtable\.com\/)([a-zA-Z0-9]+\/[a-zA-Z0-9]+)([^\s]+)/,
			embedUrl: 'https://airtable.com/embed/<%= remote_id %>?backgroundColor=yellow&viewControls=on',
			html: '<iframe class="airtable-embed" frameborder="0" onmousewheel="" width="100%" style="background: transparent; border: 1px solid #ccc;"></iframe>',
			style: {
				width: '100%',
				height: '500px',
			},
			id: (ids: Array<string>) => {
				return ids[1]
			},
		},
		vimeo: {
			regex: /(?:http[s]?:\/\/)?(?:www.)?(?:player.)?vimeo\.co(?:.+\/([^\/]\d+)(?:#t=[\d]+)?s?$)/,
			embedUrl: 'https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0',
			html: '<iframe style="width:100%;" height="320" frameborder="0"></iframe>',
			style: {
				width: '100%',
				aspectRatio: '16 / 9',
			},
		},
		youtube: {
			regex:
				/(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch|shorts))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
			embedUrl: 'https://www.youtube-nocookie.com/embed/<%= remote_id %>',
			html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
			style: {
				aspectRatio: '16 / 9',
				width: '100%',
			},
			id: ([id, params]: [id: string, params: any]) => {
				if (id.startsWith('/')) id = id.slice(1)

				if (!params && id) {
					return id
				}

				const paramsMap: { [key: string]: string } = {
					start: 'start',
					end: 'end',
					t: 'start',
					time_continue: 'start',
					list: 'list',
				}

				params = params
					.slice(1)
					.split('&')
					.map((param: string) => {
						const [name, value] = param.split('=')

						if (!id && name === 'v') {
							id = value

							return null
						}

						if (!paramsMap[name]) {
							return null
						}

						if (value === 'LL' || value.startsWith('RDMM') || value.startsWith('FL')) {
							return null
						}

						return `${paramsMap[name]}=${value}`
					})
					.filter((param: string) => !!param)

				return id + '?' + params.join('&')
			},
		},
		coub: {
			regex: /https?:\/\/coub\.com\/view\/([^\/\?\&]+)/,
			embedUrl: 'https://coub.com/embed/<%= remote_id %>',
			html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
			style: {
				height: 320,
				width: 580,
			},
		},
		vine: {
			regex: /https?:\/\/vine\.co\/v\/([^\/\?\&]+)/,
			embedUrl: 'https://vine.co/v/<%= remote_id %>/embed/simple/',
			html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
			style: {
				aspectRatio: '16 / 9',
				height: 320,
				width: 580,
			},
		},
		imgur: {
			regex: /https?:\/\/(?:i\.)?imgur\.com.*\/([a-zA-Z0-9]+)(?:\.gifv)?/,
			embedUrl: 'http://imgur.com/<%= remote_id %>/embed',
			html: '<iframe allowfullscreen="true" scrolling="no" id="imgur-embed-iframe-pub-<%= remote_id %>" class="imgur-embed-iframe-pub" style="height: 500px; width: 100%; border: 1px solid #000"></iframe>',
			height: 500,
			width: 540,
		},
		gfycat: {
			regex: /https?:\/\/gfycat\.com(?:\/detail)?\/([a-zA-Z]+)/,
			embedUrl: 'https://gfycat.com/ifr/<%= remote_id %>',
			html: "<iframe frameborder='0' scrolling='no' style=\"width:100%;\" height='436' allowfullscreen ></iframe>",
			height: 436,
			width: 580,
		},
		'twitch-channel': {
			regex: /https?:\/\/www\.twitch\.tv\/([^\/\?\&]*)\/?$/,
			embedUrl: 'https://player.twitch.tv/?channel=<%= remote_id %>',
			html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
			height: 366,
			width: 600,
		},
		'twitch-video': {
			regex: /https?:\/\/www\.twitch\.tv\/(?:[^\/\?\&]*\/v|videos)\/([0-9]*)/,
			embedUrl: 'https://player.twitch.tv/?video=v<%= remote_id %>',
			html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
			height: 366,
			width: 600,
		},
		'yandex-music-album': {
			regex: /https?:\/\/music\.yandex\.ru\/album\/([0-9]*)\/?$/,
			embedUrl: 'https://music.yandex.ru/iframe/#album/<%= remote_id %>/',
			html: '<iframe frameborder="0" style="border:none;width:540px;height:400px;" style="width:100%;" height="400"></iframe>',
			height: 400,
			width: 540,
		},
		'yandex-music-track': {
			regex: /https?:\/\/music\.yandex\.ru\/album\/([0-9]*)\/track\/([0-9]*)/,
			embedUrl: 'https://music.yandex.ru/iframe/#track/<%= remote_id %>/',
			html: '<iframe frameborder="0" style="border:none;width:540px;height:100px;" style="width:100%;" height="100"></iframe>',
			height: 100,
			width: 540,
			id: (ids: Array<string>) => ids.join('/'),
		},
		'yandex-music-playlist': {
			regex: /https?:\/\/music\.yandex\.ru\/users\/([^\/\?\&]*)\/playlists\/([0-9]*)/,
			embedUrl: 'https://music.yandex.ru/iframe/#playlist/<%= remote_id %>/show/cover/description/',
			html: '<iframe frameborder="0" style="border:none;width:540px;height:400px;" width="540" height="400"></iframe>',
			height: 400,
			width: 540,
			id: (ids: Array<string>) => ids.join('/'),
		},
		codepen: {
			regex: /https?:\/\/codepen\.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
			embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
			html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
			height: 300,
			width: 600,
			id: (ids: Array<string>) => ids.join('/embed/'),
		},
		instagram: {
			regex: /https?:\/\/www\.instagram\.com\/p\/([^\/\?\&]+)\/?.*/,
			embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
			html: '<iframe width="400" height="505" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
			height: 505,
			width: 400,
		},
		// This does not work anymore because of Elon Musk
		twitter: {
			regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+?.*)?$/,
			embedUrl: 'https://twitframe.com/show?url=https://twitter.com/<%= remote_id %>',
			html: '<iframe width="550" height="250" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
			style: {
				height: 250,
				width: 550,
			},
			id: (ids: Array<string>) => ids.join('/status/'),
		},
		pinterest: {
			regex: /https?:\/\/([^\/\?\&]*).pinterest.com\/pin\/([^\/\?\&]*)\/?$/,
			embedUrl: 'https://assets.pinterest.com/ext/embed.html?id=<%= remote_id %>',
			html: "<iframe scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; min-height: 400px; max-height: 1000px;'></iframe>",
			id: (ids: Array<string>) => {
				return ids[1]
			},
		},
		facebook: {
			regex: /https?:\/\/www.facebook.com\/([^\/\?\&]*)\/(.*)/,
			embedUrl: 'https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/<%= remote_id %>&width=500',
			html: "<iframe scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%; min-height: 500px; max-height: 1000px;'></iframe>",
			id: (ids: Array<string>) => {
				return ids.join('/')
			},
		},
		aparat: {
			regex: /(?:http[s]?:\/\/)?(?:www.)?aparat\.com\/v\/([^\/\?\&]+)\/?/,
			embedUrl: 'https://www.aparat.com/video/video/embed/videohash/<%= remote_id %>/vt/frame',
			html: '<iframe width="600" height="300" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
			height: 300,
			width: 600,
		},
		miro: {
			regex: /https:\/\/miro.com\/\S+(\S{12})\/(\S+)?/,
			embedUrl: 'https://miro.com/app/live-embed/<%= remote_id %>',
			html: '<iframe width="700" height="500" style="margin: 0 auto;" allowFullScreen frameBorder="0" scrolling="no"></iframe>',
		},
		timeTonic: {
			// example: https://timetonic.com/live/v7/externform?n=1&b_o=qchante&t=35910c37eba5c06fe79d8ab59a322dfa283d15b6f81c04907e8e
			// slitghly different example: https://timetonic.com/live/v7/externform/?b_o=jmd&t=34183d63290e0e545aff1035bc07411b239722877d1c75cb5261
			regex: /https:\/\/timetonic.com\/live\/v7\/externform\/?\?(\S+)/,
			embedUrl: 'https://timetonic.com/live/v7/externform?<%= remote_id %>',
			html: '<iframe height="800" width="100%" frameborder="0"></iframe>',
			style: {
				width: '100%',
				height: 800,
			},
		},
		loom: {
			// example: https://www.loom.com/share/36656bc4afb84de2bb829183f46a1b40
			// or https://www.loom.com/embed/36656bc4afb84de2bb829183f46a1b40
			// write a regex that matches the url and extracts the video id
			regex: /https:\/\/www.loom.com\/(share|embed)\/(\S+)/,
			embedUrl: 'https://www.loom.com/embed/<%= remote_id %>',
			html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
			style: {
				aspectRatio: '16 / 9',
				width: '100%',
			},
			id: (ids: Array<string>) => {
				return ids[1]
			},
		},
	}
}
