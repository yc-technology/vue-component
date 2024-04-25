import { ExtractPublicPropTypes, defineComponent } from 'vue'

/**
 * 属性声明
 */
const xProps = {
  image: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  rounded: {
    type: Boolean,
    default: false
  }
}

/**
 * 属性类型
 */
type XProps = ExtractPublicPropTypes<typeof xProps>

export default defineComponent({
  name: 'YcAvatar',
  props: xProps,
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props: XProps, ctx) {
    return () =>
      props.image ? (
        <img
          src={props.image}
          class={['w-8 h-8 rounded-2 flex-shrink-0', { 'rounded-full': props.rounded }]}
        />
      ) : (
        <div
          class={[
            'flex items-center justify-center w-7 h-7 rounded-2 bg-neutral-75 flex-shrink-0',
            { 'rounded-full': props.rounded }
          ]}>
          {props.label?.toString().charAt(0)}
        </div>
      )
  }
})
