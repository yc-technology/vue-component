import type { App } from 'vue'
import YcInfinityScroll from './component'

YcInfinityScroll.install = (app: App) => {
  app.component(YcInfinityScroll.name!, YcInfinityScroll)
}

export { YcInfinityScroll }

export type YcInfinityScrollIns = {
  scrollToBottom: () => void
  reload: () => void
  check: () => void
}
