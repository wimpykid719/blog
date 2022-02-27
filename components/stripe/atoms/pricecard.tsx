import { PriceCardProps } from '../../../types/stripe/PriceCard'

export default function PriceCard({ id, amount, donateId, onChange }: PriceCardProps) {
  return(
    <>
      <input type="radio" id={`price${id}`} value={id} onChange={onChange} checked={id === donateId} />
      <label htmlFor={`price${id}`}>{`${amount}円`}</label>
    </>
  )
}