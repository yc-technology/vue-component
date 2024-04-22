import type { App } from 'vue'
import YcIcon from './component'

YcIcon.install = (app: App) => {
  app.component(YcIcon.name!, YcIcon)
}

export { YcIcon }