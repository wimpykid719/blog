import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaFacebookSquare } from "@react-icons/all-files/fa/FaFacebookSquare";
import { FaLine } from "@react-icons/all-files/fa/FaLine";
import { FaGetPocket } from "@react-icons/all-files/fa/FaGetPocket";
import { SiHatenabookmark } from "@react-icons/all-files/si/SiHatenabookmark";
import { SiFeedly } from "@react-icons/all-files/si/SiFeedly";

const websiteUrl = "https://techblog-pink.vercel.app/"

export default function Social({ title, id, topics }: { title:string; id: string; topics: string[] }) {
  return (
    <>
      <div className="flex max-w-sm flex-wrap justify-between mt-3">
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-1 p-3 bg-gray-light rounded-2xl">
          <a href={`https://twitter.com/share?text=後で読む：${title}&hashtags=${topics}&url=${websiteUrl}posts/${id}&related=Unemployed_jp`}
        target='_blank' rel='noopener noreferrer'>
            <FaTwitter />
          </a>
        </button>
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-3 p-3 bg-gray-light rounded-2xl">
          <a href={`http://www.facebook.com/share.php?u=${websiteUrl}posts/${id}`} >
            <FaFacebookSquare />
          </a>
        </button>
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-3 p-3 bg-gray-light rounded-2xl">
          <a href={`https://b.hatena.ne.jp/entry/${websiteUrl}posts/${id}`} data-hatena-bookmark-layout='touch-counter'
            title={title} target='_blank' rel='noopener noreferrer'>
              <SiHatenabookmark />
          </a>
        </button>
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-3 p-3 bg-gray-light rounded-2xl">
          <a href={`https://social-plugins.line.me/lineit/share?url=${websiteUrl}posts/${id}`} target='_blank'>
            <FaLine />
          </a>
        </button>
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-3 p-3 bg-gray-light rounded-2xl">
          <a href={`http://getpocket.com/edit?url=${websiteUrl}posts/${id}`} target='_blank' rel="nofollow">
            <FaGetPocket />
          </a>
        </button>
        <button className="w-12 h-12 md:w-14 md:h-14 mr-1 mb-3 p-3 bg-gray-light rounded-2xl">
          <a href={`http://cloud.feedly.com/#subscription/feed/フィードURLたぶんRSS`} target='blank'>
            <SiFeedly />
          </a>
        </button>
      </div>
    </>
  );
}