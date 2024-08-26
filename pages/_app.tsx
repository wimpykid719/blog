import '../styles/globals.css'
import '../styles/prism-daigakusei.css'
import 'katex/dist/katex.min.css'
import { AppProps } from 'next/app'


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
