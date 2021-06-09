// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUpdatedFiles } from '../../lib/api/qiita'
import { makeQiitaArticle } from '../../lib/api/qiita'
import { postQiita } from '../../lib/api/qiita'
import { writeQiitaId } from '../../lib/api/qiita'




export default async(req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method === 'POST') {
    const files = await getUpdatedFiles(req.body)
    const articles = await Promise.all(files.map((file) => {
      return makeQiitaArticle(file)
    }))
    const postQiitaReses = await Promise.all(articles.map((article) => {
      return postQiita(article.article, article.id)
    }))
    //そもそもここのfileとidは一致してるのか...
    files.forEach((file) => {
      postQiitaReses.forEach((postQiitaRes) => {
        writeQiitaId(file, postQiitaRes.id)
      })
    })
    
    //通信が成功したらstatusコード201とJsonを返す。
    // res.status(201).json({ body: req.body })
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
