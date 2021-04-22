import Head from 'next/head'
import { getPostsData } from '../lib/posts'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'




export default function Home({ 
  allPostsData 
}: {
  allPostsData: {
    id: string
    title: string
    emoji: string
    type: string
    topics: string[]
    published: boolean
    date: string
    content: string
  }[]
}) {
  return (
    <div className="">
      <Head>
        <title>Hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ul>
          {allPostsData.map(({ id, title }) => (
            <li key={id}>
                {title}
              <br />
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = await getPostsData()
  const sortedPostData = await getSortedPostsData(allPostsData)
  return {
    props: {
      allPostsData
    }
  }
}