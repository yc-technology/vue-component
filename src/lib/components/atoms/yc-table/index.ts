import type { App } from 'vue'
import YcTable, { YcTableColumns } from './component'

YcTable.install = (app: App) => {
  app.component(YcTable.name!, YcTable)
}

export { YcTable }

export type { YcTableColumns }
