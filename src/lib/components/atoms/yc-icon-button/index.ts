import type { App } from 'vue'
import YcIconButton from './component'

YcIconButton.install = (app: App) => {
  app.component(YcIconButton.name!, YcIconButton)
}

export { YcIconButton }