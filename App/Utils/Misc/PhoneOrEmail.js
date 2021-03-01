let PhoneOrEmail = (value) => {
  let isEmail = value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  if (isEmail) return { 'email': value }
  else {
    let isPhoneNum = value.match(/\d+/g)
    if (isPhoneNum) {
      let phoneNum = isPhoneNum.join([])
      phoneNum = phoneNum.match(/\d+/g).join([])
      phoneNum = phoneNum.replace(/^62/, '0')
      if (phoneNum.match(/(^(08))\d{8,12}$/)) return { 'phone': phoneNum }
      else return { err: 'Format tidak valid' }
    } else return { err: 'Format tidak valid' }
  }
}
export default PhoneOrEmail
