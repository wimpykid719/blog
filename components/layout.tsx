import Head from 'next/head'
import { Navbar } from './menu';
import { aboutblog } from '../techBlogSettings/aboutblog'

// ここをaboutblogで設定として統一したいけどOGの設定をしてからにしたい。
export const siteTitle = '大学生だった'

//homeの型定義の?は必須の引数でない時に付ける。
export default function Layout({
    children,
    avatarUrl,
}: {
    children: React.ReactNode
    avatarUrl?: string
}) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon/favicon.ico" />
                <meta
                    name="description"
                    content={aboutblog.description}
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(siteTitle)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className="xl:flex">
              <Navbar avatarUrl={avatarUrl}/>
              <main className="lg:flex-1 bg-earth-lighter">{children}</main>
            </div>
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