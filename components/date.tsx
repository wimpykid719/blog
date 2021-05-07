import { parseISO, format } from 'date-fns'

/*
    cccc: Monday, Tuesday, ..., Sunday

    LLLL: January, February, ..., December

    d: 1, 2, ..., 31

    yyyy: 0044, 0001, 1900, 2017
*/

export default function Date({ dateString }: { dateString: string }) {
  const reDateString = dateString.replace(/\./g, '-')
  const date = parseISO(reDateString)
  return <time className="w-1/2 text-right" dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}