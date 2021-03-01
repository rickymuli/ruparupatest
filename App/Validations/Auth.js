import isEmpty from 'lodash/isEmpty'
import { IsEmail } from '../Utils/Misc'

const loginConstraints = (data) => {
  const { email, password } = data
  if (!isEmpty(email)) {
    if (!IsEmail(email)) return 'Email tidak valid'
  } else {
    return 'Email atau No hanphone tidak boleh kosong'
  }
  if (!isEmpty(password)) {
    if (password.length < 5) {
      return 'Panjang kata sandi minimal 5 karakter'
    }
  } else {
    return 'Kata sandi tidak boleh kosong'
  }
}

const forgotConstraints = (data) => {
  const { email } = data
  if (!isEmpty(email)) {
    if (!IsEmail(email)) {
      return 'Email tidak valid'
    }
  } else {
    return 'Email atau No hanphone tidak boleh kosong'
  }
}

const registerConstraints = (data) => {
  /* eslint-disable */
  const { first_name, email, password, confirm_password, phone, terms } = data
  if (isEmpty(first_name)) {
    return 'Nama lengkap tidak boleh kosong'
  }
  if (!isEmpty(email)) {
    if (!IsEmail(email)) {
      return 'Email tidak valid'
    }
  } else {
    return 'Email atau No hanphone tidak boleh kosong'
  }
  if (!isEmpty(password)) {
    if (password.length < 5) {
      return 'Panjang kata sandi minimal 5 karakter'
    } else if (!password.match(/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
      return 'Kata sandi harus menggunakan kombinasi angka dan huruf'
    }
  } else {
    return 'Kata sandi tidak boleh kosong'
  }
  if (!isEmpty(confirm_password)) {
    if (!confirm_password === password) {
      return 'Kata sandi harus sama'
    }
  } else {
    return 'Kata sandi tidak boleh kosong'
  }
  if (!isEmpty(phone)) {
    if (isNaN(phone)) {
      return 'Nomor telepon harus angka'
    } else if (phone.length < 10) {
      return 'Panjang nomor telepon minimal 10 karakter'
    }
  }
  if (!terms) {
    return 'Anda harus menyetujui syarat dan ketentuan'
  }
  return false
}

const passwordConstraints = (data) => {
  const { password, confirmPassword } = data
  if (!isEmpty(password)) {
    if (password.length < 5) {
      return 'Panjang kata sandi minimal 5 karakter'
    } else if (!password.match(/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
      return 'Kata sandi harus menggunakan kombinasi angka dan huruf'
    }
  }
  if (!isEmpty(confirm_password)) {
    if (!confirm_password === password) {
      return 'Kata sandi harus sama'
    }
  } else {
    return 'Kata sandi tidak boleh kosong'
  }
}

const resetPasswordConstraints = (data) => {
  const { password, confirmPassword, token } = data
  if (isEmpty(token)) {
    return 'Token tidak boleh kosong'
  }
  if (!isEmpty(password)) {
    if (password.length < 5) {
      return 'Panjang kata sandi minimal 5 karakter'
    } else if (!password.match(/(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)) {
      return 'Kata sandi harus menggunakan kombinasi angka dan huruf'
    }
  }
  if (!isEmpty(confirm_password)) {
    if (!confirm_password === password) {
      return 'Kata sandi harus sama'
    }
  } else {
    return 'Kata sandi tidak boleh kosong'
  }
}

export default {
  loginConstraints,
  registerConstraints,
  passwordConstraints,
  forgotConstraints,
  resetPasswordConstraints,
  passwordConstraints
}
