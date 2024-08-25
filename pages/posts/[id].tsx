import Layout from '../../components/layout'
import { getAllPostIds, getPostsData, getHtmlContent, getPostData } from '../../lib/posts'
import { getUserData } from '../../lib/user'
import Head from 'next/head'
import Date from '../../components/date'
import Social from '../../components/social'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Article } from '../../types/Article'
import { UserResponse } from '../../types/Response'


export default function Post({
    postData,
    userData
}: {
    postData: Article
    userData: UserResponse
}) {
    return (
        <Layout avatarUrl={userData.avatar_url}>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{postData.title}</title>
            </Head>
            <article className="w-11/12 lg:max-w-4xl mx-auto pb-7">
                <h1>{postData.title}</h1>
                <div>
                    <Date dateString={postData.date} />
                </div>
                <div className="pt-7">
                    <p className="font-bold text-blue-darker">あとで読む</p>
                    <Social title={postData.title} id={postData.id} topics={postData.topics} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.content }} />
            </article>
        </Layout>
    )
}



export const getStaticPaths: GetStaticPaths = async () => {
    const allPostsData = await getPostsData()
    const paths = getAllPostIds(allPostsData)
    return {
        paths,
        fallback: false
    }
}

//ここで記事のデータを取得して上のPost()のprops引数で渡してレンダリングする。
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const allPostsData = await getPostsData()
    const postData = getPostData(allPostsData, params.id as string).shift()
    const convertedPostData = await getHtmlContent(postData)
    const userData = await getUserData()
    return {
        props: {
            postData: convertedPostData,
            userData: userData
        }
    }
}