import { Icon, IconProps } from '@iconify/vue'
import { defineComponent, ExtractPublicPropTypes } from 'vue'

/**
 * 属性声明
 */
const xProps = {
  icon: {
    type: String,
    default: ''
  }
}

/**
 * 属性类型
 */
type XProps = ExtractPublicPropTypes<typeof xProps> & IconProps

export default defineComponent({
  name: 'YcIcon',
  props: xProps,
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props: XProps, ctx) {
    return () => <Icon icon={props.icon} {...ctx.attrs} />
  }
})
