import React from 'react'
import ReactDOM from 'react-dom'
import { KeepfyReactCharts } from './KeepfyReactCharts'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<KeepfyReactCharts />, document.getElementById('root'))

serviceWorker.unregister()
