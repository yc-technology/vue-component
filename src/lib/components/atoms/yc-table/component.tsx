import { isFunction, omit } from 'lodash-es'
import { NDataTable, dataTableProps } from 'naive-ui'
import { TableColumn } from 'naive-ui/es/data-table/src/interface'
import { ExtractPublicPropTypes, PropType, computed, defineComponent } from 'vue'
import { Fn } from '~/types'

/**
 * 属性声明
 */
const xProps = {
  ...omit(dataTableProps, ['columns']),
  rowClickable: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Object as PropType<YcTableColumns<any>>,
    default: () => []
  }
} as const

/**
 * 属性类型
 */
export type YcTableProps = ExtractPublicPropTypes<typeof xProps>

interface TableColumnExt {
  // 如果值是动态的请使用方法赋值形式 () => boolean
  show?: boolean | Fn<any, boolean>
  [key: string]: any
}

export type YcTableColumns<T> = Array<TableColumn<T> & TableColumnExt>

export default defineComponent({
  name: 'YcTable',
  props: xProps,
  emits: {
    rowClick: (row: any) => true
  },

  setup(props: YcTableProps, ctx) {
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

    const columns = computed(() => {
      return props.columns?.filter((e) => (isFunction(e.show) ? e.show() : e.show) !== false)
    })

    return () => (
      <NDataTable {...props} columns={columns.value} rowProps={rowProps.value}></NDataTable>
    )
  }
})
