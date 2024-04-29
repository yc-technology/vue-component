import { isUndefined } from 'lodash-es'
import { Ref, onMounted, ref, watch } from 'vue'
import { Fn } from '~/types'

export interface FetchPageResult<T> {
  items: T[]
  total?: number
  pageToken?: string | number | any
  [key: string]: any
}

export interface FetchItemsParams {
  page?: number
  pageToken?: string | number | any
  pageSize: number
  extra?: any
  abort: Ref<AbortController | undefined>
}
export type FetchItemsFn<T> = Fn<[FetchItemsParams], Promise<FetchPageResult<T>>>

type SetDataSource<T> = (data: T[], increment?: T[]) => void
export interface UsePagingOptions<T extends Record<string, any>> {
  page?: number
  pageSize?: number
  pageToken?: string | number
  itemsKey?: string
  totalKey?: string
  immediate?: boolean
  reverse?: boolean
  loading?: boolean
  dataSource?: T[]
  setDataSource?: SetDataSource<T>
  fetchFn?: FetchItemsFn<T>
  // 自动获取传递额外的返回值数据
  autoPickExtra?: string[]
  [kye: string]: any
}

export function usePaging<T extends Record<string, any>>(initialOptions: UsePagingOptions<T> = {}) {
  const options = {
    pageSize: 20,
    pageToken: `${Number.MAX_SAFE_INTEGER}`,
    itemsKey: 'items',
    totalKey: 'total'
  } as Required<NonNullable<UsePagingOptions<T>>>
  initialOptions = Object.keys(initialOptions).reduce((acc, key) => {
    if (!isUndefined(initialOptions[key])) acc[key] = initialOptions[key]

    return acc
  }, {} as UsePagingOptions<T>)
  Object.assign(options, initialOptions)
  const page = ref<number | undefined>(options.page)
  const pageSize = ref(options.pageSize!)
  const pageToken = ref<string | undefined | number>(options.pageToken)
  const total = ref(0)
  const loading = ref(options.loading)
  const finished = ref(false)
  const errored = ref(false)
  const abort = ref<AbortController>()
  // 是否已经完成第一次加载标识，用来判断是否是 empty
  const firstFetched = ref(false)
  const empty = ref(false)
  const dataSource = ref(options.dataSource || []) as Ref<T[]>
  const setDataSource =
    options.setDataSource || ((data: T[], _: T[] | undefined) => (dataSource.value = data))
  const pickExtra = ref({} as any)
  const counter = ref(0)

  const load = async () => {
    if (loading.value || finished.value || errored.value || !initialOptions.fetchFn) return
    loading.value = true
    try {
      abort.value = new AbortController()
      const res = await initialOptions.fetchFn?.({
        page: page.value,
        pageSize: pageSize.value,
        pageToken: pageToken.value,
        extra: pickExtra.value,
        abort
      })
      abort.value = undefined
      const extra = options.autoPickExtra?.reduce((acc, key) => {
        acc[key] = res[key]
        return acc
      }, {} as any)
      pickExtra.value = extra
      const remoteItems = res[options.itemsKey!] as T[]
      const remoteTotal = res[options.totalKey!] as number
      // 设置 empty

      let isFinished = false
      if (options.reverse) remoteItems.reverse()
      if (typeof page.value === 'number') {
        // 分页模式
        isFinished = remoteItems.length < pageSize.value
        setDataSource([...remoteItems])
      } else {
        // 滚动模式
        isFinished = remoteItems.length < pageSize.value || !res.pageToken
        if (options.reverse) setDataSource([...remoteItems, ...dataSource.value], remoteItems)
        else setDataSource([...dataSource.value, ...remoteItems], remoteItems)
      }

      pageToken.value = res.pageToken || undefined
      finished.value = isFinished
      total.value = remoteTotal

      if (!firstFetched.value) {
        empty.value = !remoteItems.length && !dataSource.value.length
        firstFetched.value = true
      }
    } catch (e: any) {
      // 取消请求不算错误
      if (e?.name !== 'CanceledError') errored.value = true
    } finally {
      loading.value = false
    }
  }

  const reload = () => {
    abort.value?.abort?.()
    abort.value = undefined
    page.value = typeof page.value === 'number' ? 0 : undefined
    pageToken.value = `${Number.MAX_SAFE_INTEGER}`
    loading.value = false
    finished.value = false
    firstFetched.value = false
    empty.value = false
    counter.value++
    setDataSource([])
  }

  const retry = () => {
    errored.value = false
    loading.value = false
    finished.value = false
  }

  watch([page, pageSize, counter], () => {
    retry()
    load()
  })

  // 初始化时立即获取数据
  if (options.immediate) {
    onMounted(() => {
      load()
    })
  }

  return {
    page,
    pageSize,
    dataSource,
    pageToken,
    total,
    loading,
    finished,
    errored,
    firstFetched,
    empty,
    load,
    retry,
    reload,
    setDataSource
  }
}
