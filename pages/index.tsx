import Head from 'next/head'
import { getPostsData } from '../lib/posts'
import { getSortedPostsData } from '../lib/posts'
import { getUserData } from '../lib/user'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Article } from '../types/Article'
import { UserResponse } from '../types/Response'
import Layout from '../components/layout'
import Date from '../components/date'
import Topics from '../components/topics'



const pattern = ["bg-blue", "bg-blue-light", "bg-gray", "bg-earth-light"]; 

function getColorClassFromIndex(index: number): string {
  return pattern[index % pattern.length];
}

export default function Home({ 
  sortedPostData, userData
}: {
  sortedPostData: Article[]
  userData: UserResponse
}) {
  return (
    <Layout home avatarUrl={userData.avatar_url}>
      <div className="lg:max-w-5xl lg:mx-auto">
        <Head>
          <title>Hello</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ul className="lg:flex lg:flex-wrap lg:justify-between">
          {sortedPostData.map(({ id, title, date, topics, type }, index) => (
            <li className={getColorClassFromIndex(index) + " h-60 flex justify-center items-center max-w-md w-full lg:mb-14 lg:bg-transparent" } key={id}>
              <div className="w-11/12 h-5/6 flex flex-col">
                <div className="font-bold text-xl">
                  <Link href={`/posts/${id}`}>
                    {title}
                  </Link>
                </div>
                <div className="text-xs text-gray-dark">
                  <Topics topicList={topics} />
                </div>
                <small className="border border-r-0 border-b-0 border-l-0 h-8 flex justify-between mt-auto items-end">
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
  const userData = await getUserData()
  return {
    props: {
      sortedPostData: sortedPostData,
      userData: userData, 
    }
  }
}