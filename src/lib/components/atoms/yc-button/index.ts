import type { App } from 'vue'
import YcButton from './component'

YcButton.install = (app: App) => {
  app.component(YcButton.name!, YcButton)
}

export { YcButton }