import matter from 'gray-matter'
import { Webhook } from '../../types/Response'
import { Commits } from '../../types/Response'
import { Content } from '../../types/Response'
import { QiitaArticleGetRes } from '../../types/Response'
import { QiitaPostRes } from '../../types/Response'
import { PushRes } from '../../types/Response'
import { QiitaRepository } from '../../types/Article'
import { QiitaArticle } from '../../types/Article'



//4 githubのリポジトリにqiitaIdを追加する。
export async function writeQiitaId(file: QiitaRepository, qiitaId: string) {
  console.log(`qiitaからのID： ${qiitaId}`)
  console.log(`fileからのID： ${file.qiitaId}`)
  const BASE_URL = 'https://api.github.com/repos/wimpykid719/qiita-content/contents/'
  const contentBeforeAddId = file.markdownContents
  // fileのidは空か同じものが入っているので、一致しなければ新規投稿を意味する。
  if(!(file.qiitaId === qiitaId)) {
    console.log(`sha：${file.sha}`)
    //markdownの文字列に正規表現でqiitaIdを追加する。
    const contentAddId = contentBeforeAddId.replace(/(?<=---[\s\S]*?\nqiitaId:\s*').*?(?='[\s\S]*?---)/, `${qiitaId}`)
    const buffer = Buffer.from(contentAddId, 'utf-8');
    const content = buffer.toString("base64");

    const resRepo: PushRes | undefined = await fetch(BASE_URL + file.path, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      method: 'PUT',
      body: `{\
        "message":"write ${qiitaId}",\
        "content":"${content}",\
        "sha":"${file.sha}"\
      }`,
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return
    })
    .catch(err => {
      console.log(err);
    });
    return resRepo
  }
  return 'stop to rewrite repository'
}



//3 qiitaに投稿する。
export async function postQiita(qiitaArticle: QiitaArticle, idArticle: string) {
  const url = idArticle ?
    'https://qiita.com/api/v2/items' + '/' +idArticle :
    'https://qiita.com/api/v2/items';
  console.log(`urlの確認：${url}`)

  const patchPostOk = await ( async(url, qiitaArticle, idArticle) => {
    // idがあるやつはすでに投稿されている記事なので、記事の更新かそれとも2回目のフックか判定する。
    if(idArticle) {
      // 記事が存在するのか取得する。記事があるならJsonが返る。
      const qiitaArticleGetRes: QiitaArticleGetRes | undefined = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.QIITA_TOKEN}`,
        },
        method: 'GET',
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return
        }
      })
      .catch(err => {
        console.log(err);
      })
      // もしなければidはあるが記事はないことになる。つまりidが間違っている。
      if (!qiitaArticleGetRes) {
        return false
      }
      // idがあり、アップ予定の記事タイトルと元々の記事タイトルが違う。これは更新になる。
      if(!(qiitaArticle.title === qiitaArticleGetRes.title)) {
        console.log('タイトル更新')
        return true
      }
      // idがあり、アップ予定の記事タグと元々の記事タグが違う。これは更新になる。
      const flags2 = qiitaArticle.tags.map((tag) => {
        const flags = qiitaArticleGetRes.tags.map((resTag)=> {
          if(tag.name.toLowerCase() === resTag.name.toLowerCase()) {
            return false
          } else {
            return true
          }
        })
        return flags.every(v => v)
      })
      const flag = flags2.some(v => v)
      if(flag) {
        console.log('タグ更新')
        return true
      }
      // idがあり、アップ予定の記事と元々の記事が違う。これは更新になる。
      if(!(qiitaArticle.body === qiitaArticleGetRes.body)) {
        console.log('記事更新')
        return true
      }
      // idがあって変更が確認されない場合は2回目のwebhookによるものだから処理を止める必要がある。
      return false
    }
    // idがないやつは新規投稿する。
    console.log('記事投稿')
    return true
  })(url, qiitaArticle, idArticle)

  console.log(`投稿できるか確認：${patchPostOk}`)
  if (!patchPostOk) {
    return false
  }
  const method = idArticle ? 'PATCH': 'POST';
  console.log((`methodの確認：${method}`))
  console.log(`記事のタイトル：${qiitaArticle.title}`)


  const jsonQiitaArticle: string = JSON.stringify(qiitaArticle)
  const qiitaPostRes: QiitaPostRes | undefined = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.QIITA_TOKEN}`,
    },
    method: method,
    body: jsonQiitaArticle,
  })
  .then(res => {
    if(res.ok) {
      return res.json();
    }
    return
  })
  .catch(err => {
    console.log(err);
  });
  return qiitaPostRes
}

//2 投稿・更新された記事をqiitaのフォーマットにする。
export function makeQiitaArticle(file: QiitaRepository) {
  const tags = file.topics.map((topic: string) => {
    return {'name': topic}
  })
  const article = {
    'body': file.content,
    'private': false,
    'tags': tags,
    'title': file.title,
    'tweet': true
  }
  return article
}

//1 githubから投稿・更新された記事を取得 webhookのデータが大事
export async function getUpdatedFiles(payload: Webhook) {
  const BASE_URL = 'https://api.github.com/repos/wimpykid719/qiita-content/commits/'
  const latestCommitsha: string = payload.head_commit.id

  const updatedFileContents: Commits | undefined = await fetch(BASE_URL + latestCommitsha, {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    return
  })
  .catch(err => {
    console.log(err);
  });
  const files = await Promise.all(updatedFileContents.files.map( async(updatedFile) => {
    // statusが削除のファイルは無視する。
    if(updatedFile.status === 'removed') {
      console.log('removedのステータスなのでファイルを弾いた')
      return
    }
    // statusがremoved以外でも、拡張子がmdファイル以外の場合は取得しない
    if (!/[\s\S]*?\.md/.test(updatedFile.filename)) {
      return
    }
    const fileJson: Content | undefined = await fetch(updatedFile.contents_url, {
      headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return
    })
    .catch(err => {
      console.log(err);
    });

    console.log(`fileJsonの中身：${fileJson.name}`)

    const buffer = Buffer.from(fileJson.content, 'base64');
    const markdownContents = buffer.toString("utf-8");
    const matterResult = matter(markdownContents)
    if (!matterResult.data.published) {
      return
    }
    return {
      id: fileJson.name.replace(/\.md$/, ''),
      ...(matterResult.data as { title: string; emoji: string; type: string; topics: string[]; published: boolean; date: string; qiitaId: string; }),
      content: matterResult.content,
      path: fileJson.path,
      sha: fileJson.sha,
      markdownContents: markdownContents,
    }
  }))
  return files
}