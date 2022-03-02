import { PriceCardProps } from '../../../types/stripe/PriceCard'

export default function PriceCard({ id, amount, donateId, onChange }: PriceCardProps) {
  return(
    <>
      <input
        type="radio"
        id={`price${id}`}
        className="hidden"
        value={id} onChange={onChange}
        checked={id === donateId}
      />
      <label
        htmlFor={`price${id}`}
        className={`block w-4/5 mx-auto h-48 rounded-3xl  shadow-sm ${id === donateId ? "custom-gradient" : "bg-white"} transition ease-in-out delay-300`}
      >
        <span className={`block w-3 h-3 ${id === donateId ? "bg-white" : "custom-gradient"} rounded-full transition ease-in-out delay-300`}></span>
        {`${amount}円`}
      </label>
    </>
  )
}