import { ExtractPublicPropTypes, Ref, computed, defineComponent, toRef } from 'vue'
import { NButton, buttonProps } from 'naive-ui'
import { useButton } from '~/lib/hooks/useButton'
/**
 * 属性声明
 */
const ycButtonProps = {
  ...buttonProps,
  focusable: {
    type: Boolean,
    default: false
  },
  throttle: {
    type: Boolean,
    default: false
  },
  debounce: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingDuration: {
    type: Number,
    default: 200
  },
  intervalTime: {
    type: Number,
    default: 200
  },
  autoAsync: {
    type: Boolean,
    default: false
  },
  stopPropagation: {
    type: Boolean,
    default: false
  }
} as const

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
    const { getAttrs } = useButton({
      throttle: props.throttle,
      debounce: props.debounce,
      intervalTime: props.intervalTime,
      stopPropagation: props.stopPropagation,
      onClick: props.onClick,
      autoAsync: props.autoAsync,
      loadingDuration: props.loadingDuration,
      loading: toRef(props, 'loading') as Ref<boolean>
    })

    const newProps = computed(() => {
      return { ...props, ...getAttrs.value }
    })

    return () => <NButton {...newProps.value}>{ctx.slots.default?.()}</NButton>
  }
})
