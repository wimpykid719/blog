import { useState, useEffect } from "react";
// stripeのコンポーネントを読み込んでる
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { PaymentIntentResult } from '@stripe/stripe-js'


// import { CardElementType } from './types/stripe'

export default function CheckOutForm() {
  // 第一配列がデフォルトの値, 第二配列がそれを変更する関数が入る

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | undefined | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayStripeForm, setDisplayStripeForm] = useState(true);

  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const displayForm = async () => {
    await _sleep(3000)
    setDisplayStripeForm(false)
  }

  useEffect(() => {
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
  }, [stripe]);

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
        return_url: 'http://localhost:3000/donate',
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
      <form id="payment-form" onSubmit={handleSubmit}>
        <div>決済情報</div>
          <PaymentElement id="payment-element" onReady={() => {displayForm()}}/>
          <button disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
            </span>
          </button>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
