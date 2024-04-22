import { AnyFn, Fn, useDebounceFn, useThrottleFn } from '@vueuse/core'
import { Ref, computed, ref, useAttrs } from 'vue'
import { sleep, preventDefault } from '@yc-tech/shared'
import { isFunction } from 'lodash-es'

export interface UseButtonOptions {
  loading?: Ref<boolean>
  loadingDuration?: number
  autoAsync?: boolean
  throttle?: boolean
  debounce?: boolean
  intervalTime?: number
  stopPropagation?: boolean
  onClick?: any
}

export function useButton(options: UseButtonOptions) {
  const _loading = ref(false)
  const attrs = useAttrs()

  const loading = computed(() => {
    return options.loading?.value || _loading.value
  })

  const getAttrs = computed(() => {
    const {
      throttle,
      debounce,
      intervalTime = 200,
      autoAsync,
      stopPropagation,
      onClick,
      loadingDuration
    } = options
    // 是否开启节流防抖
    const on: {
      onClick?: AnyFn
    } = {}

    if (onClick && isFunction(onClick)) {
      let clickHandler = onClick
      // 自动添加loading状态
      if (autoAsync) {
        clickHandler = async (event: any) => {
          if (loading.value) return
          _loading.value = true
          try {
            await (onClick as Function)(event)
            await sleep(loadingDuration || 200)
            _loading.value = false
          } catch (error) {
            _loading.value = false
            throw error
          }
        }
      }

      const throttledFn = debounce
        ? useDebounceFn(clickHandler, intervalTime)
        : throttle
          ? useThrottleFn(clickHandler as any, intervalTime!)
          : clickHandler
      on.onClick = (event: Event) => {
        // 外层是.stop阻止冒泡时，因为节流会导致方法间隔执行导致无法阻止冒泡
        preventDefault(event, stopPropagation)
        throttledFn(event)
      }
    } else {
      on.onClick = (event: Event) => {
        preventDefault(event, stopPropagation)
      }
    }

    return {
      ...attrs,
      ...on,
      loading: loading.value
    }
  })

  return { getAttrs }
}
