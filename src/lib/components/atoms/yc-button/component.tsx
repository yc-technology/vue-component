import { ExtractPublicPropTypes,defineComponent } from 'vue'
import {NButton, buttonProps} from 'naive-ui'
/**
 * 属性声明
 */
const ycButtonProps = {
    ...buttonProps
}

/**
 * 属性类型
 */
type YcButtonProps = ExtractPublicPropTypes<typeof ycButtonProps>

export default defineComponent({
  name: 'YcButton',
  props: ycButtonProps,
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props: YcButtonProps, ctx) {
    return () =>( 
      <NButton {...props} >
        {ctx.slots.default?.()}
      </NButton>
    )
  }
})
