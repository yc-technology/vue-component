import type { App } from 'vue'
import YcInfinityScroll, {
  ycInfinityScrollProps,
  YcInfinityScrollProps as Props
} from './component'

YcInfinityScroll.install = (app: App) => {
  app.component(YcInfinityScroll.name!, YcInfinityScroll)
}

export { YcInfinityScroll, ycInfinityScrollProps }

export type YcInfinityScrollProps = Props

export type YcInfinityScrollIns = {
  scrollToBottom: () => void
  reload: () => void
  check: () => void
}
