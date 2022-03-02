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
    <div className="lg:max-w-5xl lg:mx-auto bg-gray-light min-h-screen">
      <Head>
        <title>{donateTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit}>
        {prices.map((price, id) => (
          <PriceCard key={id} id={price.id} amount={price.amount} donateId={donateId} onChange={changePrice}/>
        ))}
        <button type="submit">決済へ</button>
      </form>
    </div>
  )
}