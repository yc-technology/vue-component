import { TableColumn } from 'naive-ui/es/data-table/src/interface'
import { UsePagingOptions, usePaging } from './usePaging'
import { Fn } from '~/types'
import { computed } from 'vue'
import { PaginationProps, PaginationSizeOption } from 'naive-ui'

interface TableColumnExt {
  // 如果值是动态的请使用方法赋值形式 () => boolean
  show?: boolean | Fn<any, boolean>
  [key: string]: any
}

export type DataTableColumnsExt<T> = Array<TableColumn<T> & TableColumnExt>

type UseTableOptions = {
  rowKeyField?: string
  showSizePicker?: boolean
  pageSizes?: (number | PaginationSizeOption)[]
} & UsePagingOptions

export function useTable<T extends Record<string, any>>({
  rowKeyField,
  showSizePicker,
  pageSizes,
  ...optionRest
}: UseTableOptions = {}) {
  const { page, pageSize, total, ...rest } = usePaging<T>(optionRest)
  const pagination = computed<PaginationProps>(() => {
    return {
      page: page.value,
      pageCount: Math.ceil(total.value / pageSize.value),
      pageSize: pageSize.value,
      showSizePicker,
      pageSizes
    }
  })

  const rowKey = computed(() => {
    if (!rowKeyField) return undefined
    return (d: T) => {
      const keys = rowKeyField.split('.')
      let obj = d
      for (const key of keys) obj = obj[key]

      // @ts-expect-error: 强制
      return obj as string | number
    }
  })

  // 点击页数时触发 loading
  const onPageChange = (v: number) => {
    page.value = v
  }

  const onPageSizeChange = (v: number) => {
    pageSize.value = v
  }

  return { pagination, page, pageSize, total, rowKey, onPageChange, onPageSizeChange, ...rest }
}
