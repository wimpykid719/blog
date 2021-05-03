import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaFacebookSquare } from "@react-icons/all-files/fa/FaFacebookSquare";
import { FaLine } from "@react-icons/all-files/fa/FaLine";
import { FaGetPocket } from "@react-icons/all-files/fa/FaGetPocket";
import { SiHatenabookmark } from "@react-icons/all-files/si/SiHatenabookmark";
import { SiFeedly } from "@react-icons/all-files/si/SiFeedly";




export default function Social({ title, id }: { title:string; id: string }) {
  return (
    <>
      <button className='twitter'>
        <a href={`https://twitter.com/share?text=${title}&hashtags=react,nextjs&url=https://next-portfolio-blue.now.sh/posts/${id}&related=Unemployed_jp`}
      target='_blank' rel='noopener noreferrer'>
          <FaTwitter />
        </a>
      </button>
      <button className='facebook'>
        <a href={`http://www.facebook.com/share.php?u=https://next-portfolio-blue.now.sh/posts/${id}`} >
          <FaFacebookSquare />
        </a>
      </button>
      <button className='hatena'>
        <a href={`https://b.hatena.ne.jp/entry/https://next-portfolio-blue.now.sh/posts/${id}`} className='hatena-bookmark-button' data-hatena-bookmark-layout='touch-counter'
          title={title} target='_blank' rel='noopener noreferrer'>
            <SiHatenabookmark />
        </a>
      </button>
      <button>
        <a href={`https://social-plugins.line.me/lineit/share?url=https://next-portfolio-blue.now.sh/posts/${id}`} target='_blank'>
          <FaLine />
        </a>
      </button>
      <button>
        <a href={`http://getpocket.com/edit?url=https://next-portfolio-blue.now.sh/posts/${id}`} target='_blank' rel="nofollow">
          <FaGetPocket />
        </a>
      </button>
      <button>
        <a href={`http://cloud.feedly.com/#subscription/feed/フィードURLたぶんRSS`} target='blank'>
          <SiFeedly />
        </a>
      </button>
    </>
  );
}