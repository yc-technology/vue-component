import { NNotificationProvider } from 'naive-ui'
import { ExtractPublicPropTypes, defineComponent } from 'vue'
import YcNotificationInner from './component'
/**
 * 属性声明
 */
const xProps = {
  disabled: {
    type: Boolean,
    default: false
  }
}

/**
 * 属性类型
 */
type XProps = ExtractPublicPropTypes<typeof xProps>

export default defineComponent({
  name: 'YcNotificationProvider',
  props: xProps,
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props: XProps, ctx) {
    return () => (
      <NNotificationProvider>
        <YcNotificationInner />
        {ctx.slots.default?.()}
      </NNotificationProvider>
    )
  }
})
