import matter from 'gray-matter'

export async function fetchGithubRep(url: string, fileName: string) {
  try {
  const res = await fetch(url + fileName, {
    headers: {"Authorization": `token ${process.env.GITHUB_TOKEN}`}
  })
  const data = await res.json()
  const buffer = Buffer.from(data.content, 'base64');
  const fileContents = buffer.toString("utf-8");
  const matterResult = matter(fileContents)
  if (!matterResult.data.published) {
    return
  }
  return {
    id: fileName.replace(/\.md$/, ''),
    ...(matterResult.data as { title: string; emoji: string; type: string; topics: string[]; published: boolean; date: string; }),
    content: matterResult.content
  }
  } catch(err) {
    console.log(`アクセスに失敗した：${err}`);
  }
  
}