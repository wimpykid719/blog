// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUpdatedFiles } from '../../lib/api/qiita'
import { makeQiitaArticle } from '../../lib/api/qiita'
import { postQiita } from '../../lib/api/qiita'
import { writeQiitaId } from '../../lib/api/qiita'
import { PushRes } from '../../types/Response'





export default async(req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === 'POST') {
    const files = await getUpdatedFiles(req.body)
    console.log(`filesフィルタ前の中身：${files[0]}`)
    console.log(`files長さ：${files.length}`)

    // udefinedが配列に含まれるので取り除く
    const filesRemovedUndefined = files.filter(Boolean)
    console.log(`filesフィルタ後の中身：${filesRemovedUndefined[0]}`)
    console.log(`filesフィルタ後の長さ：${filesRemovedUndefined.length}`)
    // filesRemovedUndefinedに値があれば処理を続ける。
    if (filesRemovedUndefined.length) {
      const statuses = await Promise.all(filesRemovedUndefined.map( async(file) => {
        //　ここじゃない
        const article = makeQiitaArticle(file)
        const qiitaPostRes = await postQiita(article, file.qiitaId)
        // falseの場合はwebhookの2回目の通信になるのでここで処理を止める。
        if (!qiitaPostRes) {
          // 多分これが実行された時点で処理止まる気がする。レスポンス返してるから
          return { status: 200, message: 'notting to upadate posts' }
        } else {
          // 上記の分岐で引っ掛からなければwriteQiitaIdを実行できる。
          const status: PushRes | string | undefined = await writeQiitaId(file, qiitaPostRes.id)
          // 書き換えが成功すればそれを伝える
          if ('object' === typeof status) {
            if(status.commit.message) {}
            console.log(status.commit.message);
            // res.status(201).json({ status: `succeeded ${status.commit.message}` })
            return { status: 201, message: `succeeded ${status.commit.message}` }
          } else if('string' === typeof status) {
            // もしrepositoryの書き換えが必要ない記事の更新の場合はリポジトリの更新が必要ないので
            // 処理を止めた事を伝える。
            return { status: 200, message: status }
          } else {
            // リポジトリの書き換えで何かエラーが発生した事を伝える。
            return { status: 502, message: 'failed to update repository' }
          }
        }
      }))
      res.status(200).json( { allstatus: statuses} )
    } else {
      res.status(200).json( { status: 'noting to post' } )
    }

    //通信が成功したらstatusコード201とJsonを返す。
    // res.status(201).json({ body: req.body })
  } else {
    res.status(200).json({ name: 'John Doe' })
  }
}
