import isEmpty from 'lodash/isEmpty'

const createRefundConstraints = (data) => {
  const { accountName, accountNumber, password, termsFlag } = data
  if (isEmpty(accountName)) {
    return 'Nama akun tidak boleh kosong'
  }
  if (isEmpty(accountNumber)) {
    return 'Nomor akun tidak boleh kosong'
  }
  if (isEmpty(password)) {
    return 'Password tidak boleh kosong'
  }
  if (!termsFlag) {
    return 'Anda harus menyetujui syarat dan ketentuan'
  }
}

const createRefundWithOtpConstraints = (data) => {
  const { accountName, accountNumber, bankId, bankBranch, otpNumber, password, termsFlag } = data
  if (isEmpty(accountName)) {
    return 'Nama akun tidak boleh kosong'
  }
  if (isEmpty(accountNumber)) {
    return 'Nomor akun tidak boleh kosong'
  }
  if (isEmpty(bankId)) {
    return 'Harap pilih bank'
  }
  if (isEmpty(bankBranch)) {
    return 'Nama cabang bank tidak boleh kosong'
  }
  if (isEmpty(otpNumber)) {
    return 'Otp tidak boleh kosong'
  }
  if (isEmpty(password)) {
    return 'Password tidak boleh kosong'
  }
  if (!termsFlag) {
    return 'Anda harus menyetujui syarat dan ketentuan'
  }
}

export default { createRefundConstraints, createRefundWithOtpConstraints }
