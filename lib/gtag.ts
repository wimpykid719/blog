import { Event } from '../types/GoogleAnalyticsEvent'
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

// IDが取得できない場合を想定する
export const existsGaId = GA_ID !== ''

// PVを測定する
export const pageview = (path: string) => {
  window.gtag('config', GA_ID, {
    page_path: path,
  })
}

// GAイベントを発火させる
export const event = ({action, category, label}: Event) => {
  if (!existsGaId) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    //JavaScriptのオブジェクトをJSONの文字列に変換している。
    event_label: JSON.stringify(label),
  })
}