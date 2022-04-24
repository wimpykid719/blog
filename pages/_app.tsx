import '../styles/globals.css'
import '../styles/prism-daigakusei.css'
import 'katex/dist/katex.min.css'
import usePageView from '../src/hooks/usePageView'
import { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  usePageView()
  return <Component {...pageProps} />
}

export default MyApp
