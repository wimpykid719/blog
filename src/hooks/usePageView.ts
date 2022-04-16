import { useEffect } from 'react'
import Router from 'next/router'

import * as gtag from '../../lib/gtag'

export default function usePageView() {
  //関数型コンポーネントのライフサイクル
  useEffect(() => {
    if (!gtag.existsGaId) {
      return
    }

    const handleRouteChange = (path: string) => {
      gtag.pageview(path)
    }
    //componentDidMountの役割URLが変更されるたびにhandleRouteChangeが実行される。
    Router.events.on('routeChangeComplete', handleRouteChange)

    //componentWillUnmontの役割
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [Router.events])
}