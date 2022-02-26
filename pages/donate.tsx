// next.js
import Head from 'next/head'
import Link from 'next/link'

// React
import { useState, useEffect } from "react";

// stripe
import { loadStripe, StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckOutForm from '../components/stripe/checkoutform'
import { donateTitle } from '../components/layout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function Donate() {

  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 1 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
      });
  }, []);
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {theme: 'stripe'},
  };


  return (
    <div className="lg:max-w-5xl lg:mx-auto">
      <Head>
        <title>{donateTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckOutForm />
        </Elements>
      )}
    </div>
  )
}