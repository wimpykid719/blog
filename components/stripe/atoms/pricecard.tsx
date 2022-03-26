import { PriceCardProps } from '../../../types/stripe/PriceCard'

export default function PriceCard({ id, amount, donateId, message, onChange }: PriceCardProps) {
  return(
    <>
      <input
        type="radio"
        id={`price${id}`}
        className="hidden hidden-after"
        value={id} onChange={onChange}
        checked={id === donateId}
      />
      <label
        htmlFor={`price${id}`}
        className={`block w-3/5 max-w-xs mb-7 h-44 rounded-3xl shadow-sm relative z-50`}
      >
        <span className="block absolute z-1 w-full p-3">
          <span className={`block mb-2 w-5 h-5 ${id === donateId ? "bg-white" :`custom-gradient${id}`} rounded-full inner-white`}></span>
          <span className="block bg-white bg-opacity-80 rounded-3xl p-3">
            <span className="block text-5xl">{`${amount}`}<small className="text-2xl">円</small></span>
            <span className="block">{message}</span>
          </span>
        </span>
        <span className={`block rounded-3xl custom-white ${id === donateId ? "opacity-0" : "opacity-1"}`} />
        <span className={`block rounded-3xl position-gradient custom-gradient${id} ${id === donateId ? "opacity-1" : "opacity-0"}`} />
      </label>
    </>
  )
}