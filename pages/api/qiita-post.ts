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
      const statuses = await Promise.all(files.map( async(file) => {
        console.log(`API側からのtopics${file.topics}`)
        const article = makeQiitaArticle(file)
        console.log(`API側からのtags${article.tags}`)
        const qiitaPostRes = await postQiita(article, file.qiitaId)
        // falseの場合はwebhookの2回目の通信になるのでここで処理を止める。
        if (!qiitaPostRes) {
          // 多分これが実行された時点で処理止まる気がする。レスポンス返してるから
          res.status(200).json({ status: 'notting to upadate posts' })
          return
        }
        // 投稿が上手くいかなかったためにエラーが起きた
        if (qiitaPostRes.type === 'error') {
          res.status(502).json({ status: `${qiitaPostRes.message}` })
          return
        }
        console.log(`qiitaIdの中身：${qiitaPostRes.id}`)
        // 上記の分岐で引っ掛からなければwriteQiitaIdを実行できる。
        const status = await writeQiitaId(file, qiitaPostRes.id)
        // 書き換えが成功すればそれを伝える
        if (status) {
          console.log(status.commit.message);
          // res.status(201).json({ status: `succeeded ${status.commit.message}` })
          return { status: 201, message: `succeeded ${status.commit.message}` }
        } else {
          // res.status(502).json({ status: 'failed to update repository' })
          return{ status: 502, message: 'failed to update repository' }
        }
      }))
      res.status(200).json({ allstatus: statuses})
    } else {
      res.status(200).json({ status: 'noting to post' })
    }
    
    //通信が成功したらstatusコード201とJsonを返す。
    // res.status(201).json({ body: req.body })
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
