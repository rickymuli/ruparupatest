import isEmpty from 'lodash/isEmpty'
import { isEmail } from '../Utils/Misc'

const b2bConstraints = (data) => {
  const { email, name, phone, message } = data
  if (!isEmpty(email)) {
    if (!isEmail(email)) {
      return 'Email tidak valid'
    }
  } else {
    return 'Email tidak boleh kosong'
  }
  if (isEmpty(name)) {
    return 'Nama tidak boleh kosong'
  }
  if (!isEmpty(phone)) {
    if (phone.match(/^[0-9]+$/)) {
      return 'Nomor telpon harus angka'
    } else if (phone.length > 10) {
      return 'Panjang nomor telepon minimal 5 karakter'
    }
  } else {
    return 'Nomor telpon tidak boleh kosong'
  }
  if (isEmpty(message)) {
    return 'Pesan tidak boleh kosong'
  }
}

export default { b2bConstraints }
