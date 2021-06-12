// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUpdatedFiles } from '../../lib/api/qiita'
import { makeQiitaArticle } from '../../lib/api/qiita'
import { postQiita } from '../../lib/api/qiita'
import { writeQiitaId } from '../../lib/api/qiita'

// import { QiitaPostRes } from '../../types/Response'
// import { QiitaPostResError } from '../../types/Response'




export default async(req: NextApiRequest, res: NextApiResponse) => {
  
  if (req.method === 'POST') {
    const files = await getUpdatedFiles(req.body)
    if (files) {
      await Promise.all(files.map( async(file) => {
        const article = makeQiitaArticle(file)
        const qiitaPostRes = await postQiita(article, file.qiitaId)
        if (!qiitaPostRes) {
          res.status(200).json({ status: 'noting to post' })
          return
        }
        if (qiitaPostRes.type === 'error') {
          res.status(502).json({ status: `${qiitaPostRes.message}` })
          return
        }
        console.log(`qiitaIdの中身：${qiitaPostRes.id}`)
        const status = await writeQiitaId(file, qiitaPostRes.id)
        if (status) {
          res.status(201).json({ status: status })
        } else {
          res.status(502).json({ status: 'failed to update repository' })
        }
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
