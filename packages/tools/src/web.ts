export namespace NWeb {
	/**
	 * Updates the specified parameter in the provided URL's query string based on the given options.
	 *
	 * @param name - The name of the parameter to update in the URL.
	 * @param target - The URLSearchParams object to update.
	 * @param opts - The options for updating the parameter.
	 *   - props: An object containing key-value pairs representing component props.
	 *   - params: URLSearchParams object containing query parameters from the current browser URL.
	 *   - default: A default value to use if the parameter is not found in props or params.
	 */
	export const useParam = (
		name: string,
		target: URLSearchParams,
		opts: {
			props?: Record<string, any>
			params?: URLSearchParams
			default?: any
		}
	) => {
		let value: any

		value = opts.props?.[name]
		value ??= opts.params?.get?.(name)?.split?.('#')?.[0]
		value ??= opts.default

		if (!value) return

		target.set(name, value.toString())
	}

	/**
	 * Query data of `target` from the renderer, inject head, style & script into the browser document.
	 *
	 * @param target - The target for the data query.
	 * @param params - The URL search parameters to include in the query.
	 * @param abortController - The AbortController for handling request aborts.
	 *
	 * @returns An object representing the result of the data query.
	 */
	export const queryData = async (
		target: string,
		params: URLSearchParams,
		abortController: AbortController
	): Promise<{ state: 'success' | 'error'; data: any } | undefined> => {
		try {
			const url = `https://bdn.notice.studio/pages/${target}/full` + (params.size > 0 ? `?${params.toString()}` : '')

			const data = await fetch(url, { signal: abortController.signal }).then((res) => {
				if (!res.ok) throw new Error()
				return res.json()
			})

			// HEAD
			const headDOM = new DOMParser().parseFromString(data.head, 'text/html')
			for (let node of headDOM.head.childNodes) {
				if (!(node instanceof HTMLElement)) continue

				// Exception for the <title>
				if (node.nodeName === 'TITLE') {
					document.title = node.innerText
					continue
				}

				// Re-create the HTMLElement with browser document
				const elem = document.createElement(node.tagName.toLowerCase())

				// Clone all attributes
				for (let i = 0; i < node.attributes.length; i++) {
					const attr = node.attributes.item(i)
					if (!attr) continue
					elem.setAttribute(attr.name, attr.value)
				}

				// Clone innerHTML if necessary
				if (node.innerHTML.trim() !== '') elem.innerHTML = node.innerHTML

				document.head.appendChild(elem)
			}

			// STYLE
			const style = document.createElement('style')
			style.id = `NTC_style-${data.rootId}`
			style.innerHTML = data.styles
			document.head.appendChild(style)

			// SCRIPT
			const script = document.createElement('script')
			script.id = `NTC_script-${data.rootId}`
			script.type = 'text/javascript'
			script.innerHTML = data.scripts
			document.head.appendChild(script)

			// BODY (nothing to do)

			return { state: 'success', data }
		} catch (ex: any) {
			if (ex.name === 'AbortError') return

			return {
				state: 'error',
				data: { body: '<p>Error!</p>' },
			}
		}
	}
}
