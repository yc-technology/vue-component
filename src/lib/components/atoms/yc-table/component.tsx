import { NDataTable, dataTableProps } from 'naive-ui'
import { ExtractPublicPropTypes, computed, defineComponent } from 'vue'

/**
 * 属性声明
 */
const xProps = {
  ...dataTableProps,
  rowClickable: {
    type: Boolean,
    default: false
  }
} as const

/**
 * 属性类型
 */
type XProps = ExtractPublicPropTypes<typeof xProps>

export default defineComponent({
  name: 'YcTable',
  props: xProps,
  emits: {
    rowClick: (row: any) => true
  },

  setup(props: XProps, ctx) {
    function innerRowProps(row: any) {
      return {
        style: 'cursor: pointer;',
        onClick: (event: any) => {
          const name = event.target.className
          if (!name || typeof name !== 'string') return
          const regex = /^(n-checkbox|n-input|n-base-selection|n-base-loading)/
          if (regex.test(name)) return
          ctx.emit('rowClick', row)
        }
      }
    }

    const rowProps = computed(() => {
      return props.rowClickable ? innerRowProps : undefined
    })

    return () => <NDataTable {...props} rowProps={rowProps.value}></NDataTable>
  }
})
