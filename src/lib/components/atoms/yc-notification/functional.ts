import { NotificationApi } from 'naive-ui'

let notificationIns: NotificationApi = {} as NotificationApi

export const YcNotification = new Proxy(notificationIns, {
  get: (t, p: any) => {
    // @ts-ignore
    return p in notificationIns ? notificationIns[p].bind() : 'err'
  }
})

export function getYcNotification() {
  return notificationIns
}

export function setYcNotification(notification: NotificationApi) {
  notificationIns = notification
}
