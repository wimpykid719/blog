import Head from 'next/head'
import { getPostsData } from '../lib/posts'
import { getSortedPostsData } from '../lib/posts'
import { generateFeedXml } from '../lib/generaterss'
import { getUserData } from '../lib/user'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { Article } from '../types/Article'
import { UserResponse } from '../types/Response'
import Layout from '../components/layout'
import Date from '../components/date'
import Topics from '../components/topics'
import { siteTitle } from '../components/layout'



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
    <Layout avatarUrl={userData.avatar_url}>
      <div className="lg:max-w-5xl lg:mx-auto">
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ul className="mx-auto lg:flex lg:flex-wrap lg:justify-between lg:max-w-2xl xl:max-w-4xl">
          {sortedPostData.map(({ id, title, date, topics, type, from }, index) => (
            <li className={getColorClassFromIndex(index) + " h-60 flex justify-center items-center lg:max-w-xs xl:max-w-sm w-full lg:mb-14 lg:bg-transparent" } key={id}>
              <div className="w-11/12 h-5/6 flex flex-col">
                <div className="font-bold text-xl">
                  <Link href={`/posts/${id}`}>
                    {title}
                  </Link>
                </div>
                <div className="text-xs text-gray-darker">
                  <Topics topicList={topics} />
                </div>
                <small className="border border-r-0 border-b-0 border-l-0 h-8 flex justify-between mt-auto items-end">
                  <span>{type}：{from}</span>
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
  if (process.env.PRODUCTION) {
    console.log('本番環境のためRSSを生成')
    generateFeedXml(sortedPostData)
  }
  const userData = await getUserData()
  return {
    props: {
      sortedPostData: sortedPostData,
      userData: userData,
    }
  }
}