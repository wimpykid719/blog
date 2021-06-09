import matter from 'gray-matter'
import { Webhook } from '../../types/Response'
import { Commits } from '../../types/Response'
import { Content } from '../../types/Response'
import { QiitaPostRes } from '../../types/Response'
import { QiitaRepository } from '../../types/Article'
import { QiitaArticle } from '../../types/Article'





//4 githubのリポジトリにqiitaIdを追加する。
export async function writeQiitaId(file, qiitaId) {
  const BASE_URL = 'https://api.github.com/repos/wimpykid719/qiita-content/contents/'
  if(!file.qiitaId === qiitaId) {
    let content = file.content
    content.qiitaId = qiitaId
    const resRepo = await fetch(BASE_URL + file.path, {
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
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
    console.log(`succeeded ${resRepo.message}`)
  }
}

//3 qiitaに投稿する。
export async function postQiita(qiitaArticle: QiitaArticle, idArticle: string) {
  const url = idArticle ? 
    'https://qiita.com/api/v2/items' + idArticle :
    'https://qiita.com/api/v2/items';
  const method = idArticle ? 'PATCH': 'POST';
  const jsonQiitaArticle: string = JSON.stringify(qiitaArticle)

  const qiitaPostRes: QiitaPostRes = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.QIITA_TOKEN}`,
    },
    method: method,
    body: jsonQiitaArticle,
  })
  .then(res => {
    return res.json();
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
  return { 'article':article, 'id':file.id }
}

//1 githubから投稿・更新された記事を取得 webhookのデータが大事
export async function getUpdatedFiles(payload: Webhook) {
  const BASE_URL = 'https://api.github.com/repos/wimpykid719/qiita-content/commits/'
  const latestCommitsha: string = payload.head_commit.id
  const updatedFileContents: Commits = await fetch(BASE_URL + latestCommitsha, {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
  .then(res => {
    return res.json();
  })
  .catch(err => {
    console.log(err);
  });
  const files = await Promise.all(updatedFileContents.files.map( async(updatedFile) => {
    const fileJson: Content = await fetch(updatedFile.contents_url, {
      headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
    })
    .then(res => {
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
    // 拡張子がmdファイル以外の場合は取得しない
    if (!/[\s\S]*?\.md/.test(fileJson.name)) {
      return
    }
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
  return files
}