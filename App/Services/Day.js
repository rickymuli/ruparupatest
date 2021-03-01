import dayjs from 'dayjs'
import 'dayjs/locale/id'

dayjs.locale('id')

// 25 Desember 2020 18:00
export const formatLLL = (date) => date ? dayjs(date).format('D MMMM YYYY H:mm') : ''

// 25 Des 20 | 18:00
export const formatWithSeparator = (date) => date ? dayjs(date).format('DD MMM YY | HH:mm') : ''
