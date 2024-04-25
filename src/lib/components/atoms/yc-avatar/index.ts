import type { App } from 'vue'
import YcAvatar from './component'

YcAvatar.install = (app: App) => {
  app.component(YcAvatar.name!, YcAvatar)
}

export { YcAvatar }
