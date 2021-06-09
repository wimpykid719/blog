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

export type QiitaArticle = {
  body: string;
  private: boolean;
  tags: {name: string}[];
  title: string;
  tweet: boolean;
}

// export type ArticleContent = ArticleTitle &{
//   content: string;
// }