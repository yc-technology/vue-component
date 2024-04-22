import type { App } from 'vue'
import YcTable from './component'

YcTable.install = (app: App) => {
  app.component(YcTable.name!, YcTable)
}

export { YcTable }
