import matter from 'gray-matter'
import { Webhook } from '../../types/Response'
import { Commits } from '../../types/Response'
import { Content } from '../../types/Response'
import { QiitaArticleGetRes } from '../../types/Response'
import { QiitaPostRes } from '../../types/Response'
import { QiitaPostResError } from '../../types/Response'
import { PushRes } from '../../types/Response'
import { QiitaRepository } from '../../types/Article'
import { QiitaArticle } from '../../types/Article'



//5 githubのリポジトリにqiitaIdを追加する。
export async function writeQiitaId(file: QiitaRepository, qiitaId: string) {
  console.log(`qiitaからのID： ${qiitaId}`)
  console.log(`fileからのID： ${file.qiitaId}`)
  const BASE_URL = 'https://api.github.com/repos/wimpykid719/qiita-content/contents/'
  const contentBeforeAddId = file.content
  if(!(file.qiitaId === qiitaId)) {
    console.log(`sha：${file.sha}`)
    //markdownの文字列に正規表現でqiitaIdを追加する。
    const contentAddId = contentBeforeAddId.replace(/(---[\s\S]*?qiitaId: )'{2}( [\s\S]*?---)/, `$1'${qiitaId}'$2`)
    const buffer = Buffer.from(contentAddId, 'utf-8');
    const content = buffer.toString("base64");

    const resRepo: PushRes = await fetch(BASE_URL + file.path, {
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
    })
    .catch(err => {
      console.log(err);
    });
    if (resRepo){
      console.log(resRepo.commit.message);
      return `succeeded ${resRepo.commit.message}`
    }
  }
}



//3 qiitaに投稿する。
export async function postQiita(qiitaArticle: QiitaArticle, idArticle: string) {
  const url = idArticle ? 
    'https://qiita.com/api/v2/items' + '/' +idArticle :
    'https://qiita.com/api/v2/items';
  console.log(`urlの確認${url}`)

  const patchOk = ( async(url, qiitaArticle, idArticle) => {
    if(idArticle) {
      const qiitaArticleGetRes: QiitaArticleGetRes = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.QIITA_TOKEN}`,
        },
        method: 'GET',
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .catch(err => {
        console.log(err);
      })
      if(!(qiitaArticle.title === qiitaArticleGetRes.title)) {
        return true
      }
      if(!(qiitaArticle.tags === qiitaArticleGetRes.tags)) {
        return true
      }
      if(!(qiitaArticle.body === qiitaArticleGetRes.body)) {
        return true
      }
    }
  })(url, qiitaArticle, idArticle)
  
  if (!patchOk) {
    return
  }
  const method = idArticle ? 'PATCH': 'POST';
  console.log((`methodの確認${method}`))
  console.log(`記事のタイトル${qiitaArticle.title}`)
  console.log(`変数${process.env.QIITA_TOKEN}`)

  
  const jsonQiitaArticle: string = JSON.stringify(qiitaArticle)
  const qiitaPostRes: QiitaPostRes | QiitaPostResError = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.QIITA_TOKEN}`,
    },
    method: method,
    body: jsonQiitaArticle,
  })
  .then(res => {
    res.json()
    .then( res => {
      console.log(`書き込みでエラーが起きてる：${res.message}`)
    })
    if (res.ok) {
      return res.json();
    }
  })
  .catch(err => {
    console.log(err);
  });
  if (qiitaPostRes.type === 'successed') {
    console.log(`記事のid：${qiitaPostRes.id}`)
    return qiitaPostRes.id
  }
  
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
  
  const updatedFileContents: Commits = await fetch(BASE_URL + latestCommitsha, {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .catch(err => {
    console.log(err);
  });
  const files = await Promise.all(updatedFileContents.files.map( async(updatedFile) => {
    // statusが削除のファイルは無視する。
    if(updatedFile.status === 'removed') {
      return
    }
    // statusがremoved以外でも、拡張子がmdファイル以外の場合は取得しない
    if (!/[\s\S]*?\.md/.test(updatedFile.filename)) {
      return
    }
    const fileJson: Content = await fetch(updatedFile.contents_url, {
      headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(err => {
      console.log(err);
    });

    console.log(`fileJsonの中身${fileJson.name}`)
    
    const buffer = Buffer.from(fileJson.content, 'base64');
    const fileContents = buffer.toString("utf-8");
    const matterResult = matter(fileContents)
    if (!matterResult.data.published) {
      return
    }
    return {
      id: fileJson.name.replace(/\.md$/, ''),
      ...(matterResult.data as { title: string; emoji: string; type: string; topics: string[]; published: boolean; date: string; qiitaId: string; }),
      content: matterResult.content,
      path: fileJson.path,
      sha: fileJson.sha,
    }
  }))
  console.log(`一番最初のtopics${files[0]}`)
  return files
}