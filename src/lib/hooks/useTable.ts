import { OnUpdateCheckedRowKeys, RowKey, TableColumn } from 'naive-ui/es/data-table/src/interface'
import { UsePagingOptions, usePaging } from './usePaging'
import { Fn } from '~/types'
import { Ref, computed, provide, ref } from 'vue'
import { PaginationProps, PaginationSizeOption } from 'naive-ui'
import { MaybeArray } from '@yc-tech/shared'

interface TableColumnExt {
  // 如果值是动态的请使用方法赋值形式 () => boolean
  show?: boolean | Fn<any, boolean>
  [key: string]: any
}

export const YcTableProvider = Symbol('YcTableProvider')

export type DataTableColumnsExt<T> = Array<TableColumn<T> & TableColumnExt>

type UseTableOptions<T extends Record<string, any>> = {
  rowKeyField?: string
  showSizePicker?: boolean
  remote?: boolean
  // 是否保留选择内容
  sequenceChecked?: boolean
  pageSizes?: (number | PaginationSizeOption)[]
} & UsePagingOptions<T>

export type YcTableContext<T> = {
  dataSource: Ref<T[]>
  setDataSource: (data: T[]) => void
  loading: Ref<boolean>
  checkedRowKeys: Ref<RowKey[]>
  checkedRows: Ref<T[]>
  pagination: Ref<PaginationProps>
}

export function useTable<T extends Record<string, any>>({
  rowKeyField,
  showSizePicker,
  pageSizes,
  remote = true,
  immediate = true,
  page: optionPage = 0,
  sequenceChecked,
  ...optionRest
}: UseTableOptions<T> = {}) {
  const { page, pageSize, total, ...rest } = usePaging<T>({
    ...optionRest,
    page: optionPage,
    remote,
    immediate
  })
  const checkedRowKeys = ref<RowKey[]>([])
  const checkedRows = ref<T[]>([]) as Ref<T[]>
  const pagination = computed<PaginationProps>(() => {
    return {
      page: (page.value || 0) + 1,
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

  const resetChecked = () => {
    checkedRowKeys.value = []
    checkedRows.value = []
  }

  // 点击页数时触发 loading
  const onPageChange = (v: number) => {
    page.value = v - 1
  }

  const onPageSizeChange = (v: number) => {
    pageSize.value = v
  }

  // @ts-ignore
  const onCheckedRowKeysChange: MaybeArray<OnUpdateCheckedRowKeys> = (
    keys: RowKey[],
    rows: T[],
    meta: {
      row: T | undefined
      action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
    }
  ) => {
    checkedRowKeys.value = keys
    checkedRows.value = rows
  }

  const tableOptions = computed(() => {
    return {
      rowKey: rowKey.value,
      pagination: pagination.value,
      checkedRowKeys: checkedRowKeys.value,
      onUpdateCheckedRowKeys: onCheckedRowKeysChange,
      onUpdatePageSize: onPageSizeChange,
      onUpdatePage: onPageChange,
      data: rest.dataSource.value,
      onUpdateData: rest.setDataSource,
      loading: rest.loading.value,
      remote: remote
    }
  })

  // 注入上下文
  provide(YcTableProvider, {
    dataSource: rest.dataSource,
    setDataSource: rest.setDataSource,
    loading: rest.loading,
    checkedRowKeys,
    checkedRows,
    pagination
  } as YcTableContext<T>)

  return {
    page,
    total,
    rowKey,
    pageSize,
    pagination,
    checkedRowKeys,
    checkedRows,
    tableOptions,
    onPageChange,
    onPageSizeChange,
    onCheckedRowKeysChange,
    ...rest
  }
}
