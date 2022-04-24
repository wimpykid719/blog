// next.js
import Head from 'next/head'
import Link from 'next/link'
// React
import { useEffect } from "react";
// lib
import { useReward } from 'react-rewards';
import { donateTitle } from '../../components/layout'
import { sleep } from '../../lib/utility/sleep';



export default function Complete() {
  const { reward, isAnimating } = useReward('rewardId', 'confetti', {
    lifetime: 300,
    spread: 90,
    elementCount: 100
  });
  const wrapedSleep = async() => {
    await sleep(1500)
  }
  useEffect(() => {

    if (document.readyState === "complete") {
      wrapedSleep()
      reward()
    } else {
      window.addEventListener('load', () => {
        wrapedSleep()
        reward()
      });
    }

  }, [])

  return (
    <main className="bg-earth-lighter">
      <div className="lg:mx-auto max-w-2xl min-h-screen w-11/12 mx-auto pt-6">
        <Head>
          <title>{donateTitle}</title>
          <link rel="icon" href="/favicon/favicon.ico" />
        </Head>
        <div className="border-2">
          <h1 className="text-2xl font-normal pl-3">
            <button onClick={reward} disabled={isAnimating}>決済完了</button>
          </h1>
        </div>
        <div className='text-center'>
          <div className="text-2xl font-normal pt-16 leading-10">
            募金ありが
            <span id="rewardId">
              と
            </span>
            うございました。<br/>お金は<span className="border-yellow border-b-4 pb-1 ">開発のために</span>とても大切に使わせて頂きます。
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-yellow w-36 h-12 mt-16 py-3 pl-3">
            <Link href='/'>Homeに戻る →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}