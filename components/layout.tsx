import Link from 'next/link'
import Head from 'next/head'
import { Navbar } from './menu';


export const siteTitle = 'Next.js Sample Website'

//homeの型定義の?は必須の引数でない時に付ける。
export default function Layout({
    children,
    home,
    avatarUrl,
}: {
    children: React.ReactNode
    home?: boolean
    avatarUrl?: string
}) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content="Learn how to build a personal website using Next.js"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className="lg:flex">
              <Navbar avatarUrl={avatarUrl}/>
              <main className="lg:flex-1 lg:bg-earth-lighter">{children}</main>
            </div>
            {!home && (
                <div>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

//三項演算子の別の書き方らしい。JSX特有かは分からない。
//https://kei-s-lifehack.hatenablog.com/entry/2021/01/20/Next.js_Tutorial_--_header_%E9%83%A8%E5%88%86%E3%81%AE%E5%88%86%E5%B2%90
// {!home && (
//   <div>
//       <Link href="/">
//           <a>← Back to home</a>
//       </Link>
//   </div>
// )}