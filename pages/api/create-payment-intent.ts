// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })

// 募金金額のidに合わせて料金を返す
const calculateOrderAmount = (id: number) => {
  switch (id) {
    case 1:
      return 200
    case 2:
      return 980
    case 3:
      return 7980
    default:
      return 200
  }
}

export default async(req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { id }: {id: number} = req.body
    const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(id),
      currency: 'jpy',
    })
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    })
  } else {
    res.status(200).json({ test: 'hi'})
  }
}