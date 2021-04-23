import Head from 'next/head'
import { getPostsData } from '../lib/posts'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Article } from '../types/Article'
import Layout from '../components/layout'




export default function Home({ 
  sortedPostData 
}: {
  sortedPostData: Article[]
}) {
  return (
    <Layout>
      <div className="">
        <Head>
          <title>Hello</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ul>
            {sortedPostData.map(({ id, title }) => (
              <li key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              </li>
            ))}
          </ul>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await getPostsData()
  const sortedPostData = await getSortedPostsData(allPostsData)
  return {
    props: {
      sortedPostData
    }
  }
}