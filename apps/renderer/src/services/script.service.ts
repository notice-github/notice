import { BLOCKS } from '@root/components/blocks'
import { ELEMENTS } from '@root/components/elements'
import { MODULES } from '@root/components/modules'
import { SPACES } from '@root/components/spaces'
import { $NTC } from '@root/system'

export namespace ScriptService {
	export const globalScripts = {
		scrollToTop() {
			$NTC.wrapper.scrollIntoView({ behavior: 'smooth' })
		},

		stopPropagation(event: MouseEvent) {
			event.stopPropagation()
		},

		createURL(strings: TemplateStringsArray, ...values: any[]) {
			const url = strings.reduce((acc, curr, idx) => acc + curr + encodeURIComponent(values[idx] ?? ''), '')
			return new URL(url)
		},

		openURL(url: string | URL) {
			if (url != null && typeof url === 'object' && 'href' in url) {
				window.open(url.href, '_blank')
			} else {
				window.open(url, '_blank')
			}
		},

		shareTo(social: 'twitter' | 'linkedin' | 'facebook', title?: string) {
			title ??= document.title

			const pageURL = new URL(document.location.href)
			pageURL.searchParams.set('lang', $NTC.lang)
			pageURL.hash = ''
			const pageHref = pageURL.href

			let url: URL | undefined

			switch (social) {
				case 'twitter':
					url = $NTC.createURL`https://twitter.com/intent/tweet?text=${title}&url=${pageHref}`
					break
				case 'linkedin':
					url = $NTC.createURL`https://www.linkedin.com/shareArticle?mini=true&title=${title}&url=${pageHref}`
					break
				case 'facebook':
					url = $NTC.createURL`https://www.facebook.com/sharer/sharer.php?u=${pageHref}`
					break
			}

			if (url) $NTC.openURL(url)
		},

		async navigateTo(pageId: string) {
			let url: URL | undefined

			switch ($NTC.navigationType) {
				case 'memory':
					$NTC.setBlockId(pageId)
					break
				case 'query':
					url = new URL($NTC.baseURL)
					url.searchParams.set($NTC.integration === 'wordpress-plugin' ? 'article' : 'page', pageId)
					break
				case 'slash':
					url = new URL($NTC.baseURL)
					url.pathname += `${url.pathname.at(-1) === '/' ? '' : '/'}${pageId}`
					break
			}

			if (url != undefined) {
				const browserParams = new URLSearchParams(location.search)
				for (const [key, value] of browserParams.entries()) {
					if (!url.searchParams.has(key)) url.searchParams.set(key, value)
				}

				const isRoot = $NTC.slugs[pageId] === $NTC.rootId || $NTC.rootId === pageId
				window.history.pushState(null, '', isRoot ? $NTC.baseURL : url.href)
			}

			$NTC.closePageTreeDrawer()
			$NTC.scrollToTop()

			return new Promise<void>((_resolve) => {
				let timeout: NodeJS.Timeout

				const resolve = () => {
					_resolve()
					$NTC.wrapper.removeEventListener('NTC_navigation', resolve)
					clearTimeout(timeout)
				}

				timeout = setTimeout(resolve, 5000)
				$NTC.wrapper.addEventListener('NTC_navigation', resolve)
			})
		},

		async fetch(path: string, params: Record<string, any> = {}, signal?: AbortSignal) {
			const url = new URL(`${$NTC.serverURL}${path}`)

			url.searchParams.set('theme', $NTC.theme)
			url.searchParams.set('lang', $NTC.lang)

			for (let key in params) {
				if (!params[key]) continue
				url.searchParams.set(key, params[key].toString())
			}

			return await fetch(url.href, { signal }).then((res) => res.json())
		},

		async reload() {
			const style = document.getElementById(`NTC_style-${$NTC.rootId}`)

			const data = await $NTC.fetch(`/document/${$NTC.blockId}?format=fragmented`)

			style.innerHTML = data.style
			$NTC.wrapper.outerHTML = data.body

			$NTC.wrapper = document.querySelector(`.NTC_wrapper[id="${$NTC.rootId}"]`)
		},

		async hydrateContent() {
			const top = $NTC.wrapper.querySelector('.NTC_space-top')
			const content = $NTC.wrapper.querySelector('.NTC_space-content')
			const bottom = $NTC.wrapper.querySelector('.NTC_space-bottom')
			const right = $NTC.wrapper.querySelector('.NTC_space-right')
			const createdWithNotice = $NTC.wrapper.querySelector('.NTC_created_with_notice_text_container') as HTMLElement

			// Loading logic
			if (createdWithNotice?.style) createdWithNotice.style.display = 'none'
			if (top) top.innerHTML = ''
			if (content) content.innerHTML = '<span class="NTC_loader" style="margin-top: 30%;"></span>'
			if (bottom) bottom.innerHTML = ''
			if (right) right.innerHTML = ''
			// End of loader logic, will be replaced when the data is fetched

			const tbf = Date.now()

			const data = await $NTC.fetch(`/body/${$NTC.blockId}?format=fragmented`)

			if (Date.now() - tbf < 150) {
				const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
				await sleep(150 - (Date.now() - tbf))
			}

			// ! This is a bandage on an open wound but it solve the problem for now
			// TODO: Solve the problem with a better solution (like abort signal with the fetch above)
			try {
				if (createdWithNotice?.style) createdWithNotice.style.display = 'flex'
				if (top && data?.top) top.outerHTML = data.top
				if (content && data?.content) content.outerHTML = data.content
				if (bottom && data?.bottom) bottom.outerHTML = data.bottom
				if (right && data?.right) right.outerHTML = data.right
			} catch (_) {}

			$NTC.injectDynamicVars()
		},

		updateNavigationMenu() {
			const menus = $NTC.wrapper.querySelectorAll('.NTC_page-tree[data-depth="0"]')

			menus.forEach((menu: HTMLDivElement) => {
				const items = menu.querySelectorAll('.NTC_page-tree-item')

				items.forEach((item: HTMLDivElement) => {
					const link = item.querySelector('.NTC_page-tree-button') as HTMLDivElement | null
					if (!link) return

					const itemPageId = item.getAttribute('id')
					const isActive = link.getAttribute('data-is-active')

					if (itemPageId === $NTC.blockId) {
						link.setAttribute('data-is-active', 'true')
					} else if (isActive === 'true') {
						link.setAttribute('data-is-active', 'false')
					}
				})
			})
		},

		async setBlockId(pageId: string) {
			const id = pageId && pageId !== 'null' ? pageId : $NTC.rootId
			$NTC.blockId = $NTC.slugs[id] ?? id

			$NTC.updateNavigationMenu()
			$NTC.hydrateContent().then(() => {
				$NTC.wrapper.dispatchEvent(new Event('NTC_navigation'))
			})
		},

		async loadOnHistoryChanges() {
			// Override the history.pushState method
			const historyPushState = history.pushState
			history.pushState = function (state, title, url) {
				// Call the original pushState method
				historyPushState.apply(history, arguments)

				// Dispatch a custom event
				const event = new CustomEvent('urlchange', { detail: { state, title, url } })
				window.dispatchEvent(event)
			}

			// Listen for the custom event
			window.addEventListener('urlchange', handleUrlChange)

			// Listen for the popstate event
			window.addEventListener('popstate', handleUrlChange)

			// Handle URL changes
			function handleUrlChange() {
				const url = document.location.href
				let pageId = $NTC.blockId

				if ($NTC.navigationType !== 'slash') {
					const searchParams = new URLSearchParams(url.split('?')[1])
					if (searchParams.has($NTC.integration === 'wordpress-plugin' ? 'article' : 'page')) {
						// Regex avoids the #anchor part of the url
						pageId = searchParams.get($NTC.integration === 'wordpress-plugin' ? 'article' : 'page').match(/^[^#]*/)[0]
					} else {
						pageId = $NTC.rootId
					}
				}

				if ($NTC.navigationType === 'slash') {
					if (document.location.pathname === new URL($NTC.baseURL).pathname) {
						pageId = $NTC.rootId
					} else {
						const paths = document.location.pathname.split('/')
						pageId = paths[paths.length - 1]
					}
				}

				if ($NTC.slugs[pageId]) pageId = $NTC.slugs[pageId]

				if ($NTC.blockId === pageId) return

				$NTC.setBlockId(pageId)
			}
		},

		injectDynamicVars() {
			$NTC.wrapper.querySelectorAll('.NTC_code-content').forEach((el) => {
				const regex = /{{{(\w+)}}}/g
				if (!regex.test(el.innerHTML)) return

				const queryParam = (name: string) => {
					const params = new URLSearchParams(new URL(window.location.href).search)
					return params.get(name)
				}

				el.innerHTML = el.innerHTML.replace(regex, (fullmatch, submatch) => {
					const param = queryParam(submatch)
					return param ?? fullmatch
				})
			})
		},

		defineBaseURL() {
			const url = new URL(document.location.href)

			const paths = url.pathname.split('/')
			const lastPath = paths[paths.length - 1]

			const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/i

			if (uuidRegex.test(lastPath) || $NTC.slugs[lastPath] != undefined) {
				url.pathname = paths.slice(0, -1).join('/')
			}

			url.searchParams.delete('page')
			url.hash = ''

			$NTC.baseURL = url.href.at(-1) === '/' ? url.href.slice(0, -1) : url.href
		},
	}
	export type globalScripts = typeof globalScripts

	export const blocksScripts = () => {
		return Object.keys(BLOCKS).reduce<((...args: any[]) => any)[]>((functions, key) => {
			const block = BLOCKS[key as keyof BLOCKS]

			if ('JS' in block) return [...functions, ...Object.values(block.JS)]
			else return functions
		}, [])
	}

	export const spacesScripts = () => {
		return Object.keys(SPACES).reduce<((...args: any[]) => any)[]>((functions, key) => {
			const space = SPACES[key as keyof SPACES]

			if ('JS' in space) return [...functions, ...Object.values(space.JS)]
			else return functions
		}, [])
	}

	export const userScripts = (ctx): string => {
		return ctx.rootBlock?.userCode?.JS ?? ''
	}

	export const modulesScripts = () => {
		return Object.keys(MODULES).reduce<((...args: any[]) => any)[]>((functions, key) => {
			const module = MODULES[key as keyof MODULES]

			if ('JS' in module) return [...functions, ...Object.values(module.JS)]
			else return functions
		}, [])
	}

	export const elementsScripts = () => {
		return Object.keys(ELEMENTS).reduce<((...args: any[]) => any)[]>((functions, key) => {
			const element = ELEMENTS[key as keyof ELEMENTS]

			if ('JS' in element) return [...functions, ...Object.values(element.JS)]
			else return functions
		}, [])
	}
}
