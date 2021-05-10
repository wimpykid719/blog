import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import prism from 'remark-prism'
import gfm from 'remark-gfm'
//マークダウンから数式を解析
import math from 'remark-math'
//解析された数式をkatexが読み込めるようにHTML変換する。
import htmlKatex from 'remark-html-katex'
import { ArticleResponse } from '../types/Response'
import { Article } from '../types/Article'


export async function getPostsData() {
  const zennArticles: ArticleResponse[] = await fetch("https://api.github.com/repos/wimpykid719/zenn-content/contents/articles", {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
  const datas = await (async (zennArticles) => {
    if (zennArticles) {
      return await Promise.all(zennArticles.map(async (article: ArticleResponse) => {
        const data = await fetch("https://api.github.com/repos/wimpykid719/zenn-content/contents/articles/" + article.name, {
          headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
        })
          .then(res => {
              return res.json();
          })
          .catch(err => {
              console.log(`アクセスに失敗した：${err}`);
          });
        const buffer = Buffer.from(data.content, 'base64');
        const fileContents = buffer.toString("utf-8");
        const matterResult = matter(fileContents)
        if (!matterResult.data.published) {
          return
        }
        return {
          id: article.name.replace(/\.md$/, ''),
          ...(matterResult.data as { title: string; emoji: string; type: string; topics: string[]; published: boolean; date: string; }),
          content: matterResult.content
        }
      }));
    }
  })(zennArticles);
  const removeFalsyDatas = datas.filter(Boolean)
  return removeFalsyDatas;
}

export async function getSortedPostsData(articles: Article[]){
  return articles.sort((a, b) => {
    if (a.date === b.date){
      return 0
    }
    if (a.date < b.date) {
        return 1
    } else {
        return -1
    }
  })
}

export async function getHtmlContent(article: Article) {
  const processedContent = await remark()
    .use(math)
    .use(htmlKatex)
    .use(html)
    .use(prism)
    .use(gfm)
    .process(article.content)
  const contentHtml = processedContent.toString()
  return {
    ...article,
    content: contentHtml
  }
}

export function getAllPostIds(articles: Article[]) {
  return articles.map((article: Article) => {
    return {
      params: {
          id: article.id
      }
    }
  })
}

export function getPostData(articles: Article[], id: string) {
  return articles.filter((article: Article) => {
    if(article.id === id) {
      return article
    }
  })
} 


// title: "tsconfig.json オプション入門" # 記事のタイトル
// emoji: "🧐" # アイキャッチとして使われる絵文字（1文字だけ）
// type: "tech" # tech: 技術記事 / idea: アイデア記事
// topics: ["typescript", "初心者", "作業ログ"] # タグ。["markdown", "rust", "aws"]のように指定する
// published: true # 公開設定（falseにすると下書き）
// http://robin.hatenadiary.jp/entry/2017/01/08/225337 bugger.from推奨