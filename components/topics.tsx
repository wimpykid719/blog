export default function Topics({ topicList }: { topicList: string[] }) {
  return (
    <>
      {topicList.map(topic => (<span className="mr-2.5" key={topic}>{topic}</span>))}
    </>
  );
}