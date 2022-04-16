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

import { EventManager } from '../../lib/utility/eventManager'
import { sleep } from '../../lib/utility/sleep'

import { description } from "../../techBlogSettings/checkformdescription";
import { aboutblog } from "../../techBlogSettings/aboutblog";


// import { CardElementType } from './types/stripe'

export default function CheckOutForm({donate}: CheckOutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayStripeForm, setDisplayStripeForm] = useState(true);
  const [startY, setStartY] = useState(0);
  const [endY, setEndY] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [stripeFormWrapperHeight, setStripeFormWrapperHeight] = useState(0);
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

  const displayUpStripeForm = () => {
    const swipeUp = 0 < (endY - startY) && 50 < Math.abs((endY - startY))
      ? `translateY(${stripeFormWrapperHeight - 50}px)` : 'translateY(0px)';
    if (stripeFormWrapper.current) {
      stripeFormWrapper.current.style.transform = swipeUp
      const formStatus = swipeUp === 'translateY(0px)' ? true : false
      setToggle(formStatus)
    }
  }

  const displayForm = async () => {
    await sleep(3000)
    setDisplayStripeForm(false)
    const height = stripeFormWrapper.current.getBoundingClientRect().height
    console.log('初期のフォーム高さ', height)
    setStripeFormWrapperHeight(height)
    if (window.innerWidth < 1024) {
      stripeFormWrapper.current.style.transform = `translateY(${height - 50}px)`
    }
  }

  const observeStripeFormHeight = () => {
    // 登録した要素のサイズ変更を監視
    const observer = new ResizeObserver(() => {
      if (stripeFormWrapper.current) {
        const height = stripeFormWrapper.current.getBoundingClientRect().height
        setStripeFormWrapperHeight(height)
      }
    });

    if(stripeFormWrapper.current) {
      observer.observe(stripeFormWrapper.current);
    }
  }

  const observeStripeForm = (windowEventManager) => {
    windowEventManager.add('touchstart',(event) => {
      setStartY(event.touches[0].pageY)
    })
    windowEventManager.add('touchmove',(event) => {
      setEndY(event.touches[0].pageY)
    })
    observeStripeFormHeight()
  }

  const swipeDisplayUpStripeForm = (windowEventManager) => {
    windowEventManager.add('touchend',() => {
      displayUpStripeForm()
    })
  }

  useEffect(() => {
    const windowEventManager = new EventManager(window);
    const mqlPC = window.matchMedia('(min-width:1024px)')
    mqlPC.addEventListener('change', ev => {
      console.log('初期ローディング')
      // ここで一旦解除してレイアウトも戻す
      windowEventManager.removeAll('touchstart');
      windowEventManager.removeAll('touchmove');
      windowEventManager.removeAll('touchend');
      if (stripeFormWrapper.current) {
        stripeFormWrapper.current.style.transform = `translateY(0px)`
      }
      if (ev.matches) {
        // pc用何もしない
        setToggle(false)
        return
      }
      // pcサイズじゃない場合元に戻す
      observeStripeForm(windowEventManager);
      swipeDisplayUpStripeForm(windowEventManager);
      // if (stripeFormWrapper.current) {
      //   const height = stripeFormWrapper.current.getBoundingClientRect().height
      //   console.log('モバイル用', height)
      //   stripeFormWrapper.current.style.transform = `translateY(${height - 50}px)`
      // }
    })
    if (document.readyState === "complete") {
      if (window.innerWidth < 1024) {
        observeStripeForm(windowEventManager);
        swipeDisplayUpStripeForm(windowEventManager);
      }
    } else {
      if (window.innerWidth < 1024) {
        window.addEventListener('load', observeStripeForm);
        swipeDisplayUpStripeForm(windowEventManager);
      }
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
        return_url: `${aboutblog.url}donate/complete`,
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
        <div className="fixed inset-0 w-full h-full bg-stripe z-30 flex justify-center items-center">
          <div className=" w-9/12 max-w-2xl bg-white rounded-3xl mx-auto p-8 cutom-box-shadow-black">
            <div className="spinner"></div>
            <span>決済情報を確認しています...</span>
          </div>
        </div>
      )}
      <div className={`${toggle ? '' : 'hidden'} w-full h-full bg-gray-darker opacity-50 fixed z-10 transition-opacity`}></div>
      <form id="payment-form" className="lg:flex lg:justify-between pt-7" onSubmit={handleSubmit}>
        <div className="lg:max-w-sm lg:m-0 w-11/12 mx-auto">
          <h1 className="text-2xl p-0 mb-4 font-normal">決済内容</h1>
          <div className="flex justify-between bg-white rounded-xl shadow-lg p-4">
            <div className={`w-12 h-12 ${donateInfo.color} rounded-md flex justify-center items-center`}></div>
            <div className="text-2xl pt-5">{`${donateInfo.info.amount}`}<small className="text-xs">円</small></div>
          </div>
          <div className="mt-8">
            <ul className="list-disc pl-5 mb-checkout-description">
              <li>{description.text1}</li>
              <li>{description.text2}{donateInfo.info.message}</li>
              <li>{description.text3}</li>
              <li>{description.text4}</li>
            </ul>
          </div>
        </div>
        <div className="bg-stripe lg:rounded-b-3xl rounded-3xl rounded-b-none px-5 pb-12 lg:max-w-sm z-20 lg:static fixed w-full bottom-0 transition-transform" ref={stripeFormWrapper}>
          <div className="h-14 w-11/12 mx-auto mb-6 mt-3 lg:invisible">
            <div className="h-1 w-4/12 bg-gray rounded-full mx-auto"></div>
          </div>
          <PaymentElement
            className="mb-16 text-white"
            onReady={() => {displayForm()}}
          />
          <button  className="bg-green w-full h-12 text-white font-medium rounded-md hover:shadow-lg" disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner-2" id="spinner"></div> : `${donateInfo.info.amount}円 支払う`}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message" className="text-red">{message}</div>}
        </div>
      </form>
    </>
  );
}
