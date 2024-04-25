import type { App } from 'vue'
import YcDialog from './component'

YcDialog.install = (app: App) => {
  app.component(YcDialog.name!, YcDialog)
}

export { YcDialog }
