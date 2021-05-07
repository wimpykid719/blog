import '../styles/globals.css'
import "../styles/prism-daigakusei.css"
import "katex/dist/katex.min.css"
import usePageView from '../src/hooks/usePageView'

function MyApp({ Component, pageProps }) {
  usePageView()
  return <Component {...pageProps} />
}

export default MyApp
