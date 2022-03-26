export type PriceCardProps = {
  id: string;
  amount: number;
  donateId: string;
  message: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}