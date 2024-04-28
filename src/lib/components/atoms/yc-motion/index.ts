import { ComponentPublicInstance } from 'vue'
import { MotionInstance, Variant } from '@vueuse/motion'
import type { App } from 'vue'
import YcMotion from './component'

YcMotion.install = (app: App) => {
  app.component(YcMotion.name!, YcMotion)
}

export { YcMotion }

export type YcMotionIns = ComponentPublicInstance<{
  motion: MotionInstance<
    string,
    {
      initial: Variant | undefined
      enter: Variant | undefined
      leave: Variant | undefined
      visible: Variant | undefined
      visibleOnce: Variant | undefined
      hovered: Variant | undefined
      tapped: Variant | undefined
      focused: Variant | undefined
    }
  >
}>
