import { NSpin } from 'naive-ui'
import { ExtractPublicPropTypes, PropType, defineComponent, provide, ref, watch } from 'vue'
import { FetchItemsFn } from '~/lib/hooks'
import { usePagingScroll } from '~/lib/hooks/usePagingScroll'
import { YcButton } from '../yc-button'

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
  pageToken: {
    type: String || Number
  },
  contentClass: {
    type: String
  },
  dataSource: {
    type: Object as PropType<any[]>,
    default: () => []
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
  emits: ['update:dataSource'],
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
      scrollToBottom,
      reload,
      check
    } = usePagingScroll(scrollRef, props.fetchItemsFn || defaultFetchItemsFn, {
      dataSource: props.dataSource,
      pageSize: 5,
      pageToken: props.pageToken,
      ...props
    })

    watch(dataSource, (v) => {
      ctx.emit('update:dataSource', v)
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
        <div class={'flex justify-center gap-1 py-2 text-5'}>
          <div class="mingcute:box-2-line w-5 h-6" />
          <div class="text-md"> empty </div>
        </div>
      )
    }

    function Finish() {
      if (ctx.slots.finish) return ctx.slots.finish()
      return (
        <div class={'flex justify-center gap-1 py-2 text-5 text-neutral-300 items-center gap-2'}>
          <div class="mingcute:check-line"></div>
          <div class="text-md"> no more</div>
        </div>
      )
    }

    function Error() {
      if (ctx.slots.error) return ctx.slots.error()
      return (
        <div class="flex flex-col items-center gap-2  p-1 rounded-2">
          <YcButton type="error" onClick={retry}>
            <div class="flex items-center gap-1">
              <div class="i-mingcute:close-circle-line" />
              <div>retry</div>
            </div>
          </YcButton>
        </div>
      )
    }

    function State() {
      if (loading.value) return Loading()
      else if (empty.value) return Empty()
      else if (finished.value) return Finish()
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
      check
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
