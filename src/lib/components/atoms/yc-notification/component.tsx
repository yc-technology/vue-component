import { useNotification } from 'naive-ui'
import { defineComponent, onMounted } from 'vue'
import { setYcNotification } from './functional'

export default defineComponent({
  name: 'YcNotification',
  emits: {
    // someEmit: (value: string) => typeof value === 'string'
  },
  setup(props, ctx) {
    const notification = useNotification()
    onMounted(() => {
      setYcNotification(notification)
    })
    return () => ctx.slots.default?.()
  }
})
