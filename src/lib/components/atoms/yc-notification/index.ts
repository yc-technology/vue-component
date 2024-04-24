import type { App } from 'vue'
import YcNotificationProvider from './provider'
import { YcNotification } from './functional'
YcNotificationProvider.install = (app: App) => {
  app.component(YcNotificationProvider.name!, YcNotificationProvider)
}

export { YcNotificationProvider, YcNotification }
