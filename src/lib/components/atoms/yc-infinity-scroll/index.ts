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

export type YcInfinityScrollIns<T extends Record<string, any> = Record<string, any>> = {
  scrollToBottom: () => void
  reload: () => void
  check: () => void
  dataSource: T[]
}
