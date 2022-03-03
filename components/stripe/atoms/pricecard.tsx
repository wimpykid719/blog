import { PriceCardProps } from '../../../types/stripe/PriceCard'

export default function PriceCard({ id, amount, donateId, onChange }: PriceCardProps) {
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
        className={`block w-4/5 mx-auto h-48 rounded-3xl shadow-sm relative z-50`}
      >
        <span className={`block absolute z-10 w-3 h-3 ${id === donateId ? "bg-white" : "bg-blue"} rounded-full transition-all ease-in-out delay-300`}></span>
        {`${amount}円`}
        <span className={`block rounded-3xl custom-white ${id === donateId && "opacity-0"}`} />
        <span className={`block rounded-3xl custom-gradient${id}`} />
      </label>
    </>
  )
}