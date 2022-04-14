// next.js
import Head from 'next/head'
import Link from 'next/link'
// React
import { useState, useEffect } from "react";
// lib
import { useReward } from 'react-rewards';
import { donateTitle } from '../../components/layout'
import { sleep } from '../../lib/utility/sleep';



export default function Complete() {
  const { reward, isAnimating } = useReward('rewardId', 'confetti');

  useEffect(() => {
    (async() => {
      await sleep(3000)
      reward()
    })()

  }, [])

  return (
    <main className="bg-gray-light">
      <div className="lg:mx-auto max-w-2xl min-h-screen mx-auto">
        <Head>
          <title>{donateTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <span>決済完了</span>
        <button  disabled={isAnimating}>
          <span id="rewardId" />
          🎉
        </button>
      </div>
    </main>
  )
}