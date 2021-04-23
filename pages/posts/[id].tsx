import Layout from '../../components/layout'
import { getAllPostIds, getPostsData, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Article } from '../../types/Article'


export default function Post( { postData }: { postData: Article }) {
    return (
        <Layout>
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
    return {
        props: {
            postData
        }
    }
}