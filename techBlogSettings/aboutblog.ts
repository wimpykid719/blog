export const aboutblog = {
  url: (() => {
    if (process.env.PRODUCTION) {
      return 'https://techblog-pink.vercel.app/'
    }
    return 'http://localhost:3000/'
  })(),
  title: "大学生だった",
  description: "Zennに投稿した記事を使用して作成したオリジナルブログ、プログラミング技術に関する内容を投稿します。",
}