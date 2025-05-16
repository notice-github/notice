import './polyfills'

import { createRoot } from 'react-dom/client'

import { NoticeApp } from './app'

const container = document.getElementById('root')
if (container == null) throw new Error('/!\\ [FATAL ERROR] Root element not found /!\\')

const root = createRoot(container)
root.render(<NoticeApp />)
