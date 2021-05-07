import { useEffect } from 'react'
import Router from 'next/router'

import * as gtag from '../../lib/gtag'

export default function usePageView() {
  useEffect(() => {
    if (!gtag.existsGaId) {
      return
    }

    const handleRouteChange = (path) => {
      gtag.pageview(path)
    }

    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [Router.events])
}