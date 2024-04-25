import { AnyFn, isClient, useDebounceFn, useInfiniteScroll, useScroll } from '@vueuse/core'
import { nextTick, onMounted, ref, watch, type Ref, type UnwrapNestedRefs } from 'vue'
import type { FetchItemsFn } from './usePaging'
import { usePaging } from './usePaging'

export interface UsePagingScrollOptions<T extends Record<string, any>> {
  threshold?: number
  offset?: number
  reverse?: boolean
  immediate?: boolean
  pageSize?: number
  pageToken?: number | string
  dataSource?: T[]
  setDataSource?: (data: T[], increment?: T[]) => void
}

export function usePagingScrollWithFn<T extends Record<string, any>>(
  fetchFn: FetchItemsFn<T>,
  options: UsePagingScrollOptions<T> = {}
) {
  const {
    threshold = 100,
    offset = 50,
    reverse,
    pageSize,
    immediate,
    setDataSource,
    pageToken
  } = options
  const { loading, load, finished, dataSource, ...rest } = usePaging({
    dataSource: options.dataSource,
    setDataSource,
    fetchItemsFn: fetchFn,
    reverse,
    pageSize,
    pageToken
  })

  const currScrollTop = ref(0)
  const target = ref<HTMLElement>()

  const loadMore = async () => {
    if (finished.value || loading.value || !target.value) return
    await load()
    if (reverse) target.value.scrollTop = currScrollTop.value + target.value.scrollHeight
  }

  const check = async () => {
    if (!target.value) return
    await nextTick()
    const { scrollTop, scrollHeight, offsetHeight } = target.value
    if (reverse) {
      if (scrollTop <= offset) loadMore()
    } else {
      if (scrollTop + offsetHeight + offset >= scrollHeight) loadMore()
    }
    currScrollTop.value = scrollTop
  }

  const onScroll = useDebounceFn((e: Event) => {
    const currTarget = e.target as HTMLElement
    target.value = currTarget
    check()
  }, threshold)

  const scrollToBottom = () => {
    if (target?.value) {
      const scrollContainer = target?.value as HTMLElement
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }, 1)
    }
  }

  // 监听需要监听的数据源变化
  watch([dataSource, finished], () => {
    check()
  })

  if (immediate) {
    onMounted(() => {
      if (isClient) check()
    })
  }
  return { loading, finished, dataSource, scrollToBottom, onScroll, load, ...rest }
}

export function usePagingScroll<T extends Record<string, any>>(
  target: Ref<HTMLElement | Document | null>,
  fetchFn: FetchItemsFn<T>,
  options: UsePagingScrollOptions<T> = {}
) {
  const { threshold = 100, reverse, pageSize, immediate, setDataSource, pageToken } = options
  const { loading, load, finished, errored, dataSource, retry, ...rest } = usePaging({
    dataSource: options.dataSource,
    setDataSource,
    fetchFn,
    reverse,
    pageSize,
    pageToken
  })

  const measure = ref<AnyFn>()
  const currScrollTop = ref(0)
  const counter = ref(0)

  const loadMore = async (state: UnwrapNestedRefs<ReturnType<typeof useScroll>>) => {
    measure.value = state.measure
    if (finished.value || loading.value || errored.value) return
    console.info('load', state)
    await load()
    // 只有向上滚动时才触发
    if (reverse) {
      const scrollContainer = target!.value as HTMLElement
      scrollContainer.scrollTop = currScrollTop.value + scrollContainer.scrollHeight
    }
  }

  if (target && isClient) {
    useInfiniteScroll(target, loadMore, {
      direction: reverse ? 'top' : 'bottom',
      interval: threshold,
      onStop: () => {
        const scrollContainer = target!.value as HTMLElement
        const { scrollTop, scrollHeight } = scrollContainer
        currScrollTop.value = scrollTop - scrollHeight
      }
    })
  }

  const scrollToBottom = () => {
    if (target!.value) {
      const scrollContainer = target!.value as HTMLElement
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }, 1)
    }
  }

  // 监听需要监听的数据源变化
  watch([dataSource, finished, errored, counter], () => {
    measure.value?.()
  })

  onMounted(() => {
    if (isClient && immediate) measure.value?.()
    // if (reverse)
    //   scrollToBottom()
  })
  const check = () => {
    measure.value?.()
  }
  return { loading, finished, errored, dataSource, check, retry, scrollToBottom, load, ...rest }
}
