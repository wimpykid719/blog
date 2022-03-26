// next.js
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { prices } from '../../techBlogSettings/pricelist'

// React
import { useState, useEffect } from "react";

import { donateTitle } from '../../components/layout'
import PriceCard from '../../components/stripe/atoms/pricecard'



export default function Price() {

  const [clientSecret, setClientSecret] = useState("");
  const [donateId, setDonateId] = useState("1");

  const handleSubmit = (event) => {
  }

  const changePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDonateId(event.target.value);
  }

  return (
    <main className="bg-gray-light pt-8">
      <div className="lg:mx-auto max-w-2xl min-h-screen mx-auto">
        <Head>
          <title>{donateTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap justify-center md:justify-between">
            {prices.map((price, id) => (
              <PriceCard key={id} id={price.id} amount={price.amount} donateId={donateId} message={price.message} onChange={changePrice}/>
            ))}
          </div>
          <button type="submit">決済へ</button>
        </form>
      </div>
    </main>
  )
}