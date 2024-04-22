import { NTooltip } from 'naive-ui'
import { YcIcon } from '../yc-icon'
import { PropType, defineComponent, toRef } from 'vue'
import { useButton } from '~/lib/hooks/useButton'
import { MaybeArray } from '@yc-tech/shared'

export default defineComponent({
  name: 'YcIconButton',
  props: {
    iconClass: String,
    icon: String,
    tooltip: String,
    hiddenDefaultStyle: Boolean,
    throttle: Boolean,
    debounce: Boolean,
    intervalTime: Number,
    stopPropagation: Boolean,
    autoAsync: Boolean,
    loadingDuration: Number,
    loading: Boolean,
    onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>
  },
  setup(props, { slots, attrs }) {
    const { getAttrs } = useButton({
      throttle: props.throttle,
      debounce: props.debounce,
      intervalTime: props.intervalTime,
      stopPropagation: props.stopPropagation,
      onClick: props.onClick,
      autoAsync: props.autoAsync,
      loadingDuration: props.loadingDuration,
      loading: toRef(props, 'loading')
    })

    const renderIcon = (className?: string) => (
      <div
        class={[{ 'icon-btn': !props.hiddenDefaultStyle }, className]}
        onClick={getAttrs.value.onClick}>
        {getAttrs.value.loading ? (
          <div class={['i-mingcute:loading-line animate-spin', props.iconClass]} />
        ) : (
          <YcIcon icon={props.icon} class={[props.iconClass]} />
        )}
        {slots.default?.()}
      </div>
    )

    const renderTooltip = () => {
      return (
        <NTooltip>
          {{
            trigger: () => renderIcon(attrs.class as string),
            default: () => props.tooltip || ''
          }}
        </NTooltip>
      )
    }

    const renderRoot = () => (props.tooltip ? renderTooltip() : renderIcon())

    return () => renderRoot()
  }
})
