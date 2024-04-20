export interface Fn<T extends Array<any> = any[], R = T> {
  (...arg: T): R
}
