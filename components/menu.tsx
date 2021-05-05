import Link from 'next/link';
import Image from 'next/image'
import { useState } from 'react';
import { aboutme } from '../aboutme'
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";


export const Navbar = ({
  avatarUrl
  } : {
    avatarUrl: string
  }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      {/* 下記のコードは三項演算子を使用していてactiveがTrueなら空が適用される。それで要素が出てくる。最初はfalseで要素を隠す。 */}
      <nav className={`${
        active ? '' : '-translate-x-72'
      } xl:flex flex-wrap bg-earth-light p-1.5 fixed z-10 w-72 transform transition-transform xl:static xl:translate-x-0 xl:bg-blue-light overflow-y-auto disable-scrollbars inset-y-0 min-h-screen rounded-3xl rounded-tl-none rounded-bl-none xl:rounded-none`}
      >
        <div className="flex justify-end xl:hidden">
            <button
              className="inline-flex p-3 hover:bg-gray rounded outline-none text-blue-dark"
              onClick={handleClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-8 lg:w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        <div className="w-60 mx-auto">
          <div className="text-blue-dark flex justify-between mt-7">
            <div>
              <Image
                src={avatarUrl}
                alt="avatar"
                width={80}
                height={80}
                className="rounded-3xl"
              />
            </div>
            <div>
              <p className="text-xl font-bold">大学生だった.</p>
              <ul className="text-xs font-extralight mt-2">
                <li><a href={aboutme.twitterURL} target="_blank"><FaTwitter />　{aboutme.twitterID}</a></li>
                <li><a href={aboutme.githubURL} target="_blank"><FaGithub />　{aboutme.githubID}</a></li>
              </ul>
            </div>
          </div>
          <div className="text-sm text-blue-dark mt-2">
            <p className="text-base font-bold">自己紹介</p>
            <p>{aboutme.description}</p>
            <br/>
            <p className="text-base font-bold">使う技術</p>
            <p>{aboutme.tech}</p>
            <br/>
            <p className="text-base font-bold">今やってる事</p>
            <p>{aboutme.lately}</p>
            <br/>
            <p className="text-base font-bold">今後やりたい事</p>
            <p>{aboutme.future}</p>
          </div>
          <div className='flex flex-col text-blue-dark mt-10 mb-10'>
            <Link href='/'>
              <a className='inline-flex lg:w-auto w-full px-3 py-2 rounded font-bold items-center justify-center '>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </a>
            </Link>
          </div>
        </div>
      </nav>
      <div className="bg-earth-lighter p-1.5 xl:hidden">
        <button
          className="inline-flex p-3 hover:bg-gray rounded outline-none lg:text-lg"
          onClick={handleClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      </div>
    </>
  );
};