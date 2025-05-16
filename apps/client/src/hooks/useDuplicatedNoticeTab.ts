/*
The hook tracks the every browser tab with notice opened
and uses uuid to identify the tab with value stored to the window.name property
and active tab value is stored to the local storage under 'notice_active_tab'

we compare both values window.name and localStorage if they are different
we throw a toast asking to reload.
*/

import { useLayoutEffect } from 'react'
import { callDuplicateWindowToast } from '../components/Toast/DuplicateWindowToast'

export const useDuplicatedNoticeTab = () => {
	try {
		const noticeTabChannel = new BroadcastChannel(location.origin) // create a new BroadcastChannel for site with same origin

		const LOCAL_STORAGE_TAB_KEY = 'notice_active_tab' // local storage key
		const localValue = localStorage.getItem(LOCAL_STORAGE_TAB_KEY)

		const getWindowName = () => {
			return window.name
		}

		const setWindowName = (val: string) => {
			window.name = val
			return
		}

		useLayoutEffect(() => {
			const tabGuid = crypto.randomUUID() // generate unique identifier
			setWindowName(tabGuid) // set the new window name on load

			localStorage.setItem(LOCAL_STORAGE_TAB_KEY, tabGuid) // set the new local storage on load

			noticeTabChannel.onmessage = () => {
				const windowName = getWindowName()

				if (localValue !== null && localValue !== windowName) {
					// if the window name and local guid are different throw a toast
					callDuplicateWindowToast()
				}
			}

			window.onunload = () => {
				// remove active tab value on window unload
				localStorage.setItem(LOCAL_STORAGE_TAB_KEY, '')
			}

			noticeTabChannel.postMessage(`new window opened`) // send the channel message on every new tab opened
		}, [noticeTabChannel, localValue])
	} catch (e) {
		console.log('sorry, your browser does not support broadcast channel api.')
	}
}
