import { useState, useEffect, useRef} from "react";
// stripeのコンポーネントを読み込んでる
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { PaymentIntentResult } from '@stripe/stripe-js'

import { CheckOutFormProps } from '../../types/stripe/CheckOutForm'

import { prices } from '../../techBlogSettings/pricelist'


// import { CardElementType } from './types/stripe'

export default function CheckOutForm({donate}: CheckOutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayStripeForm, setDisplayStripeForm] = useState(true);
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);
  const [stripeFormWrapperHeight, setStripeFormWrapperHeight] = useState(0);
  const [toggle, setToggle] = useState(false);
  const stripeFormWrapper = useRef<HTMLDivElement>(null);

  // フック化したいけどtailwindcssのコンパイル時にファイル内にクラス名がないとcssが出力されなくなる
  const donateInfo = ((donate) => {
    switch(donate) {
      case "1":
        return {
          color: "custom-orange",
          info: prices[0]
        }
      case "2":
        return {
          color: "custom-blue",
          info: prices[1]
        }
      case "3":
        return {
          color: "custom-yellow",
          info: prices[2]
        }
    }
  })(donate)

  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const displayUpStripeForm = () => {
    const swipeUp = 0 < (endY - startY) && 100 < Math.abs((endY - startY))
      ? 'translateY(0px)' : `translateY(${stripeFormWrapperHeight}px)`;
    if (stripeFormWrapper.current) {
      stripeFormWrapper.current.style.transform = swipeUp
    }
  }

  const displayForm = async () => {
    await _sleep(3000)
    setDisplayStripeForm(false)
    const height = stripeFormWrapper.current.getBoundingClientRect().height
    stripeFormWrapper.current.style.transform = `translateY(${height}px)`
    setStripeFormWrapperHeight(height)
  }

  const observeGridY = () => {
    window.addEventListener('touchstart',(event) => {
      setStartY(event.touches[0].pageY)
    })
    window.addEventListener('touchmove',(event) => {
      setEndY(event.touches[0].pageY)
    })
  }
  const swipeDisplayUpStripeForm = () => {
    window.addEventListener('touchend',() => {
      displayUpStripeForm()
      // setToggle(swipeUp)
    })
  }

  useEffect(() => {
    if (document.readyState === "complete") {
      observeGridY();
      swipeDisplayUpStripeForm();
    } else {
      window.addEventListener('load', observeGridY);
      observeGridY();
      swipeDisplayUpStripeForm();
    }

    if (!stripe) {
      return;
    }

    //URLのクエリから値を取得する
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    // リダイレクト時にここに値が入る
    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: PaymentIntentResult) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [,stripe, startY, endY]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `http://localhost:3000/donate/checkout?donate=${donate}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };


  return (
    <>
      {displayStripeForm && (
        <div className="fixed inset-0 w-full h-full bg-stripe z-10 flex justify-center items-center">
          <div className=" w-9/12 max-w-2xl bg-white rounded-3xl mx-auto p-8 cutom-box-shadow-black">
            <div className="spinner"></div>
            <span>決済情報を確認しています...</span>
          </div>
        </div>
      )}
      <form id="payment-form" className="lg:flex lg:justify-between pt-7" onSubmit={handleSubmit}>
        <div className="lg:max-w-sm lg:m-0 w-11/12 mx-auto">
          <h1 className="text-2xl p-0 mb-4 font-normal">決済内容</h1>
          <div className="flex justify-between bg-white rounded-xl shadow-lg p-4">
            <div className={`w-12 h-12 ${donateInfo.color} rounded-md flex justify-center items-center`}></div>
            <div className="text-2xl pt-5">{`${donateInfo.info.amount}`}<small className="text-xs">円</small></div>
          </div>
          <div className="mt-8">
            <ul className="list-disc pl-5">
              <li>stripeを通して作者に募金します。</li>
              <li>このお金で開発に必要となる、{donateInfo.info.message}</li>
              <li>作者はこれを糧としてサービス開発・技術記事の執筆に努め募金者に還元します。</li>
            </ul>
          </div>
        </div>
        <div className="bg-stripe rounded-3xl px-5 pb-12 lg:max-w-sm fixed w-full bottom-0 transition-transform" ref={stripeFormWrapper}>
          <button className="block h-14 w-11/12 mx-auto mb-8">
            <div className="h-1 w-4/12 bg-gray rounded-full mx-auto"></div>
          </button>
          <PaymentElement className="mb-16 text-white" onReady={() => {displayForm()}}/>
          <button  className="bg-green w-full h-12 text-white font-medium rounded-md hover:shadow-lg" disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : `${donateInfo.info.amount}円 支払う`}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </div>
      </form>
    </>
  );
}
