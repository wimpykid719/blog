import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import { Response } from '../types/Response'
import { Article } from '../types/Article'
import { accessToken } from '../token'


export async function getPostsData() {
  const zennArticles: Response[] = await fetch("https://api.github.com/repos/wimpykid719/zenn-content/contents/articles", {
    headers: {"Authorization": accessToken}
  })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
  const datas = await (async (zennArticles) => {
    if (zennArticles) {
      return await Promise.all(zennArticles.map(async (article: Response) => {
        const data = await fetch("https://api.github.com/repos/wimpykid719/zenn-content/contents/articles/" + article.name, {
          headers: {"Authorization": accessToken}
        })
          .then(res => {
              return res.json();
          })
          .catch(err => {
              console.log(err);
          });
        const buffer = Buffer.from(data.content, 'base64');
        const fileContents = buffer.toString("utf-8");
        const matterResult = matter(fileContents)
        const processedContent = await remark()
          .use(html)
          .process(matterResult.content)
        const contentHtml = processedContent.toString()
        return {
          id: article.name.replace(/\.md$/, ''),
          ...(matterResult.data as { title: string; emoji: string; type: string; topics: string[]; published: boolean; date: string; }),
          content: contentHtml,
        }
      }));
    }
  })(zennArticles);
  return datas;
}

export async function getSortedPostsData(articles: Article[]){
  
}

// if (mdObj.data.published) {
//   datas[mdObj.data.title] = mdObj.content;
//   keys.push(mdObj.data.title);
// }
// title: "tsconfig.json オプション入門" # 記事のタイトル
// emoji: "🧐" # アイキャッチとして使われる絵文字（1文字だけ）
// type: "tech" # tech: 技術記事 / idea: アイデア記事
// topics: ["typescript", "初心者", "作業ログ"] # タグ。["markdown", "rust", "aws"]のように指定する
// published: true # 公開設定（falseにすると下書き）
// http://robin.hatenadiary.jp/entry/2017/01/08/225337 bugger.from推奨