// next.js
import Head from 'next/head'
import { useRouter } from 'next/router';

// React
import { useState, useEffect, useRef } from "react";
// stripe
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckOutForm from '../../components/stripe/checkoutform'
import { donateTitle } from '../../components/layout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)


export default function Donate() {
  const router = useRouter()
  const donate = router.query.donate
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    console.log('値段', donate);
    (async () => {
      const res = await fetch('/api/create-payment-intent', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: donate }] })
      })
      if (!res.ok) {
        throw `payment-intentでエラー：${res.status}`
      }
      const data = await res.json()
      setClientSecret(data.clientSecret)
    })()
  }, [donate]);
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorBackground: "#4864e8",
        colorText: '#fff',
        spacingGridRow: "40px"
      },
      rules: {
        '.Input:focus': {
          border: '1px solid #2dd7e0',
        },
      }
    },
  };


  return (
    <main className="bg-gray-light min-h-screen" >
      <div className="lg:max-w-5xl lg:mx-auto">
        <Head>
          <title>{donateTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise} key={clientSecret}>
            <CheckOutForm donate={donate} />
          </Elements>
        )}
      </div>
    </main>
  )
}