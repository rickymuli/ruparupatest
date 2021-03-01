import isEmpty from 'lodash/isEmpty'
const CheckUndefined = (storeCode) => {
  return (!isEmpty(storeCode) && typeof storeCode !== 'undefined' && storeCode !== 'undefined' ? storeCode : '')
}
export default CheckUndefined
