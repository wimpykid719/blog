import Layout from '../../components/layout'
import { getAllPostIds, getPostsData, getHtmlContent, getPostData } from '../../lib/posts'
import { getUserData } from '../../lib/user'
import Head from 'next/head'
import Date from '../../components/date'
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
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1>{postData.title}</h1>
                <div>
                    <Date dateString={postData.date} />
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