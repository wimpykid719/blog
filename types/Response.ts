export type ArticleResponse = {
  name: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  }
}

export type UserResponse = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url:  string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: null | string;
  company: null | string;
  blog: string;
  location: null | string;
  email: null | string;
  hireable: null | string;
  bio: null | string;
  twitter_username: null | string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export type Webhook = {
  head_commit: {
    id: string;
  }
}

export type Commits = {
  files:[{
    filename: string;
    status: string;
    contents_url: string;
  }]
}

export type Content = {
  name: string;
  path: string;
  sha: string;
  content: string;
}

export type QiitaArticleGetRes = {
  body: string;
  private: boolean;
  tags: {name: string}[];
  title: string;

}

export type QiitaPostRes = {
  type: "successed";
  id: string;
}

export type QiitaPostResError = {
  type: "error";
  message: string;
}

export type PushRes = {
  commit: {
    message: string;
  }
}

