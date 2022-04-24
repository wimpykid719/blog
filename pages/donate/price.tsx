// next.js
import Head from 'next/head'
import { useRouter } from 'next/router';
import { prices } from '../../techBlogSettings/pricelist'

// React
import { useState } from "react";

import { donateTitle } from '../../components/layout'
import PriceCard from '../../components/stripe/atoms/pricecard'


export default function Price() {
  const router = useRouter()
  const [donateId, setDonateId] = useState('1');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    // formにURLが指定されてない時デフォルトの操作で現在のURLにpostを投げてページを更新させてしまうので
    // それを防ぐために下記のコードを実行している
    e.preventDefault()
    // e.currentTarget.elementsこれでformの値をまとめて取れるけど今回はステートに既に値があるので
    // そちらを使用する
    // donateIdを渡して次のページに遷移する
    router.push({
      pathname: '/donate/checkout',
      query: { donate: donateId }
    });
  }

  const changePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonateId(event.target.value);
  }

  return (
    <main className="bg-gray-light">
      <div className="lg:mx-auto max-w-2xl min-h-screen mx-auto">
        <Head>
          <title>{donateTitle}</title>
          <link rel="icon" href="/favicon/favicon.ico" />
        </Head>
        <div>
          <h1 className="text-2xl font-normal pl-3">募金額を選択</h1>
        </div>
        <form className="py-8" onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-center md:justify-between">
            {prices.map((price, id) => (
              <PriceCard key={id} id={price.id} amount={price.amount} donateId={donateId} message={price.message} onChange={changePrice}/>
            ))}
          </div>
          <button
            className="w-36 h-12 rounded-full text-white bg-stripe custom-box-shadow mx-auto flex justify-center items-center"
            type="submit"
          >
            <span className="block mr-3">決済へ</span>
            <span className="block h-8 w-8 rounded-full custom-area-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="mt-1 h-4 w-4" fill="currentColor">
                <path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>
              </svg>
            </span>
          </button>
        </form>
      </div>
    </main>
  )
}