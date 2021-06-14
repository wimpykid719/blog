import { QiitaArticleGetRes } from './Response'

export type Article = {
  id: string;
  title: string;
  emoji: string;
  type: string;
  topics: string[];
  published: boolean;
  date: string;
  content: string;
}

export type QiitaRepository = {
  id: string;
  title: string;
  emoji: string;
  type: string;
  topics: string[];
  published: boolean;
  date: string;
  qiitaId: string;
  content: string;
  path: string;
  sha: string;
}



type QiitaArticleTwitterSettings = {
  tweet: boolean;
}

//　こんな風に継承できるけど分かりづらいな
export type QiitaArticle = QiitaArticleGetRes & QiitaArticleTwitterSettings

// export type ArticleContent = ArticleTitle &{
//   content: string;
// }