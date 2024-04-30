import { NSpin } from 'naive-ui'
import { ExtractPublicPropTypes, PropType, defineComponent, provide, ref, watch } from 'vue'
import { FetchItemsFn } from '~/lib/hooks'
import { usePagingScroll } from '~/lib/hooks/usePagingScroll'
import { YcButton } from '../yc-button'
import { YcIcon } from '../yc-icon'

const InfiniteScrollProviderKey = 'InfiniteScrollProvider'

/**
 * 属性声明
 */
export const ycInfinityScrollProps = {
  fetchItemsFn: {
    type: Function as PropType<FetchItemsFn<Record<string, any>>>
  },
  threshold: {
    type: Number,
    default: 200
  },
  offset: {
    type: Number
  },
  reverse: {
    type: Boolean,
    default: false
  },
  immediate: {
    type: Boolean,
    default: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showEmpty: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: 'no data.'
  },
  showFinished: {
    type: Boolean,
    default: true
  },
  finishedText: {
    type: String,
    default: 'no more data.'
  },
  pageToken: {
    type: String || Number
  },
  contentClass: {
    type: String
  },
  dataSource: {
    type: Object as PropType<any[]>,
    default: () => []
  },
  setDataSource: {
    type: Function as PropType<(data: any[]) => void>
  }
} as const

const defaultFetchItemsFn: FetchItemsFn<Record<string, any>> = async () => {
  return { items: [], total: 0, pageToken: '' }
}

/**
 * 属性类型
 */
export type YcInfinityScrollProps = ExtractPublicPropTypes<typeof ycInfinityScrollProps>

export default defineComponent({
  name: 'YcInfinityScroll',
  props: ycInfinityScrollProps,
  emits: ['update:dataSource', 'firstFetched'],
  setup(props: YcInfinityScrollProps, ctx) {
    const scrollRef = ref<HTMLElement | Document | null>(null)
    const {
      dataSource,
      total,
      errored,
      retry,
      loading,
      empty,
      finished,
      firstFetched,
      scrollToBottom,
      reload,
      check
    } = usePagingScroll(scrollRef, props.fetchItemsFn || defaultFetchItemsFn, {
      dataSource: props.dataSource,
      setDataSource: props.setDataSource,
      pageSize: 5,
      pageToken: props.pageToken,
      ...props
    })

    watch(dataSource, (v) => {
      ctx.emit('update:dataSource', v)
    })

    watch(firstFetched, (v) => {
      ctx.emit('firstFetched', v, dataSource.value)
    })

    watch(
      () => props.dataSource,
      (v) => {
        dataSource.value = v || []
      }
    )

    function Loading() {
      if (ctx.slots.loading) return ctx.slots.loading()
      return (
        <div class={'flex justify-center py-2 text-5'}>
          <NSpin show={loading.value} />
        </div>
      )
    }

    function Empty() {
      if (ctx.slots.empty) return ctx.slots.empty()
      return (
        <div class={'flex justify-center items-center gap-1 py-2 text-5'}>
          <YcIcon icon="mingcute:box-2-line" class="w-5 h-6" />
          <div class="text-md">{props.emptyText}</div>
        </div>
      )
    }

    function Finish() {
      if (!props.showFinished) return null
      if (ctx.slots.finish) return ctx.slots.finish()
      return (
        <div class={'flex justify-center gap-1 py-2 text-5 text-neutral-300 items-center gap-2'}>
          <YcIcon icon="mingcute:check-line" />
          <div class="text-md">{props.finishedText}</div>
        </div>
      )
    }

    function Error() {
      if (ctx.slots.error) return ctx.slots.error()
      return (
        <div class="flex flex-col items-center gap-2  p-1 rounded-2">
          <YcButton type="error" onClick={retry}>
            <div class="flex items-center gap-1">
              <YcIcon icon="i-mingcute:close-circle-line" />
              <div>retry</div>
            </div>
          </YcButton>
        </div>
      )
    }

    function State() {
      if (loading.value) return Loading()
      else if (empty.value && props.showEmpty) return Empty()
      else if (finished.value && props.showFinished) return Finish()
      else if (errored.value) return Error()
    }

    provide(InfiniteScrollProviderKey, {
      scrollRef,
      dataSource,
      total
    })

    ctx.expose({
      scrollToBottom,
      reload,
      check,
      dataSource
    })

    return () => (
      <div ref={scrollRef} class="overflow-auto">
        {props.reverse && State()}
        <div class={props.contentClass}>
          {dataSource.value?.map((e, i) =>
            ctx.slots.item?.({ key: e.id || `infinity-${i}`, item: e })
          )}
        </div>
        {ctx.slots.default?.()}
        {!props.reverse && State()}
      </div>
    )
  }
})
