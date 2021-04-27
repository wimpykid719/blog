import Head from 'next/head'
import { getPostsData } from '../lib/posts'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Article } from '../types/Article'
import Layout from '../components/layout'
import Date from '../components/date'
import Topics from '../components/topics'



const pattern = ["bg-blue", "bg-blue-light", "bg-gray", "bg-earth-light"]; 

function getColorClassFromIndex(index: number): string {
  return pattern[index % pattern.length];
}

export default function Home({ 
  sortedPostData
}: {
  sortedPostData: Article[]
}) {
  return (
    <Layout home>
      <div className="">
        <Head>
          <title>Hello</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ul>
          {sortedPostData.map(({ id, title, date, topics, type }, index) => (
            <li className={"h-52 flex justify-center items-center " + getColorClassFromIndex(index)} key={id}>
              <div className="w-11/12 h-5/6 flex flex-col">
                <Link href={`/posts/${id}`}>
                  {title}
                </Link>
                <div className="">
                  <Topics topicList={topics} />
                </div>
                <small className="flex justify-between mt-auto items-end">
                  <span>{type}</span>
                  <Date dateString={date} />
                </small>
              </div>
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