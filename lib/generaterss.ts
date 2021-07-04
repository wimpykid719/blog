import fs from 'fs'
import { Feed } from 'feed'
import { getHtmlContent } from './posts'
import { aboutblog } from '../techBlogSettings/aboutblog'
import { aboutme } from '../techBlogSettings/aboutme'

import { Article } from '../types/Article'

export async function generateFeedXml(posts: Article[]){
  const date = new Date()
  const author = {
    name: '大学生だった.',
    link: aboutme.twitterURL,
  }

  const feed = new Feed({
    title: aboutblog.title,
    description: aboutblog.description,
    id: aboutblog.url,
    link: aboutblog.url,
    language: 'ja', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `${aboutblog.url}favicon/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, ${aboutblog.title}`,
    updated: date, // optional, default = today
    generator: 'Feed', // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: `${aboutblog.url}rss/json`,
      atom: `${aboutblog.url}rss/atom`,
      rss2: `${aboutblog.url}rss/atom`,
    },
    author: author,
  })

  for(const post of posts) {
    const convertHtmlPost = await getHtmlContent(post)

    // 記事の内容から約140文字のdescriptionを作成する。
    const markdownContent = post.content
    const text140 = markdownContent.slice(0, 140)
    const removedSymbol = text140.replace(/\`|\[記事\]\[[0-9]\]|\n#+[\s\S]*?\n|#+[\s\S]*|\n|-|>/g, '')
    const description = removedSymbol + '...'

    feed.addItem({
      title: post.title,
      id: `${aboutblog.url}posts/${post.id}`,
      link: `${aboutblog.url}posts/${post.id}`,
      description: description,
      content: convertHtmlPost.content,
      date: new Date(post.date),
    })
  }
  feed.addCategory('Technologie')

  // フィード情報を public/rss 配下にディレクトリを作って保存
  fs.mkdirSync('./public/rss', { recursive: true });
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
}
