import { NModal, modalProps } from 'naive-ui'
import { ExtractPublicPropTypes, computed, defineComponent } from 'vue'

export const ycDialogProps = {
  ...modalProps,
  show: {
    type: Boolean,
    default: false
  },
  closeBtn: {
    type: Boolean,
    default: true
  },

  closeBtnClass: String,

  lazy: {
    type: Boolean,
    default: false
  }
}

export type YcDialogProps = ExtractPublicPropTypes<typeof ycDialogProps>

export default defineComponent({
  name: 'YcDialog',
  props: ycDialogProps,
  setup(props, { slots, emit }) {
    const newProps = computed(() => {
      // @ts-ignore
      return { closeable: true, transformOrigin: 'center', ...props }
    })
    return () => (
      <NModal {...newProps.value} class={['flex items-center justify-center']}>
        <div class={['bg-white', props.contentClass]}>{slots.default?.()}</div>
      </NModal>
    )
  }
})
