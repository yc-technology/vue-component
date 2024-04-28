import { Variant, useMotion } from '@vueuse/motion'
import { ExtractPublicPropTypes, PropType, defineComponent, ref } from 'vue'

/**
 * 属性声明
 */
const xProps = {
  initial: {
    type: Object as PropType<Variant>
  },
  enter: {
    type: Object as PropType<Variant>
  },
  leave: {
    type: Object as PropType<Variant>
  },
  visible: {
    type: Object as PropType<Variant>
  },
  visibleOnce: {
    type: Object as PropType<Variant>
  },
  hovered: {
    type: Object as PropType<Variant>
  },
  tapped: {
    type: Object as PropType<Variant>
  },
  focused: {
    type: Object as PropType<Variant>
  }
}

/**
 * 属性类型
 */
export type YcMotionProps = ExtractPublicPropTypes<typeof xProps>

export default defineComponent({
  name: 'YcMotion',
  props: xProps,
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props: YcMotionProps, ctx) {
    const targetRef = ref<HTMLElement | null>(null)
    const ins = useMotion(targetRef, {
      initial: props.initial,
      enter: props.enter,
      leave: props.leave,
      visible: props.visible,
      visibleOnce: props.visibleOnce,
      hovered: props.hovered,
      tapped: props.tapped,
      focused: props.focused
    })
    ctx.expose({
      motion: ins
    })
    return () => <div ref={targetRef}></div>
  }
})
