// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUpdatedFiles } from '../../lib/api/qiita'
import { makeQiitaArticle } from '../../lib/api/qiita'
import { postQiita } from '../../lib/api/qiita'
import { writeQiitaId } from '../../lib/api/qiita'




export default async(req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method === 'POST') {
    const files = await getUpdatedFiles(req.body)
    if (files) {
      await Promise.all(files.map( async(file) => {
        const article = makeQiitaArticle(file)
        const createdQiitaId = await postQiita(article, file.qiitaId)
        const status = writeQiitaId(file, createdQiitaId)
        res.status(201).json({ status: status })
      }))
    } else {
      res.status(200).json({ status: 'noting to post' })
    }
    
    //通信が成功したらstatusコード201とJsonを返す。
    // res.status(201).json({ body: req.body })
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
