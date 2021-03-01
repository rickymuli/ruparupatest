import NumberWithCommas from './NumberWithCommas'
import NumberFormat from './NumberFormat'
import UpperCase from './UpperCase'
import CheckUndefined from './CheckUndefined'
import Chunkify from './Chunkify'
import ItemFilter from './ItemFilter'
import PhoneOrEmail from './PhoneOrEmail'
import IsEmail from './IsEmail'

const UpperFirst = (string) => (UpperCase(string.toLowerCase()))

const ReplaceArray = (data, index, newData) => {
  let temp = JSON.parse(JSON.stringify(data))
  temp[index] = newData
  return temp
}

export {
  NumberWithCommas,
  NumberFormat,
  UpperCase,
  CheckUndefined,
  Chunkify,
  ItemFilter,
  PhoneOrEmail,
  UpperFirst,
  ReplaceArray,
  IsEmail
}
