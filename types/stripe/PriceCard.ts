export type PriceCardProps = {
  id: string;
  amount: number;
  donateId: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}