import isEmpty from 'lodash/isEmpty'
import { IsEmail } from '../Utils/Misc'

const updateConstraints = (data) => {
  /* eslint-disable */
  const { first_name, email, phone } = data
  if (isEmpty(first_name)) {
    return 'Nama lengkap tidak boleh kosong'
  }
  if (!isEmpty(email)) {
    if (!IsEmail(email)) {
      return 'Email tidak valid'
    }
  } else {
    return 'Email tidak boleh kosong'
  }
  if (!isEmpty(phone)) {
    if (!phone.match(/^[0-9]+$/)) {
      return 'Nomor telepon harus angka'
    }
    if (phone.length < 10) {
      return 'Panjang nomor telepon minimal 10 karakter'
    }
  } else {
    return 'Nomor telpon tidak boleh kosong'
  }
}

const addressConstraints = (data) => {
  /* eslint-disable */
  const { address_name, first_name, phone, full_address, post_code, province, city, kecamatan } = data
  if (isEmpty(address_name)) {
    return 'Nama alamat tidak boleh kosong'
  }
  if (isEmpty(first_name)) {
    return 'Nama lengkap tidak boleh kosong'
  }
  if (!isEmpty(phone)) {
    if (!phone.match(/^[0-9]+$/)) {
      return 'Nomor telepon harus angka'
    }
    if (phone.length < 10) {
      return 'Panjang nomor telepon minimal 10 karakter'
    }
  } else {
    return 'Nomor telpon tidak boleh kosong'
  }
  if (isEmpty(full_address)) {
    return 'Alamat tidak boleh kosong'
  }
  if (isEmpty(province.province_id)) {
    return 'Provinsi tidak boleh kosong'
  }
  if (isEmpty(city.city_id)) {
    return 'Kota tidak boleh kosong'
  }
  if (isEmpty(kecamatan.kecamatan_id)) {
    return 'Kecamatan tidak boleh kosong'
  }
  if (!isEmpty(post_code)) {
    if (!post_code.match(/^[0-9]+$/)) {
      return 'Kode pos harus angka'
    }
  } else {
    return 'Kode pos tidak boleh kosong'
  }
}

const getPointConstraints = (data) => {
  const { company_id, member_id, member_pin} = data
  if (isEmpty(company_id)) {
    return 'Terjadi kesalahan, ulangi beberapa saat lagi'
  }
  if (isEmpty(member_id)) {
    return 'Member tidak boleh kosong'
  }
  if (isEmpty(member_pin)) {
    return 'Passkey tidak boleh kosong'
  }
}

const redeemPointConstraints = (data) => {
  const { company_id, member_id, member_pin, balance} = data
  if (isEmpty(company_id)) {
    return 'Terjadi kesalahan, ulangi beberapa saat lagi'
  }
  if (isEmpty(member_id)) {
    return 'Member tidak boleh kosong'
  }
  if (isEmpty(member_pin)) {
    return 'Passkey tidak boleh kosong'
  }
  if (isEmpty(balance)) {
    return 'Terjadi kesalahan, ulangi beberapa saat lagi'
  }
}

const memberGroupAHIConstraints = (data) => {
  const { AHI } = data
  if (!AHI.match(/^(ARE|TAM|AR).+$/) || AHI.length < 10) {
    return 'Member number Ace tidak ditemukan'
  }
}

const memberGroupHCIConstraints = (data) => {
  const { HCI } = data
  if (!HCI.match(/IR.+$/) || HCI.length < 10) {
    return 'Member number Informa tidak ditemukan'
  }
}

const memberGroupTGIConstraints = (data) => {
  const { TGI } = data
  if (!TGI.match(/SC.+$/) || TGI.length < 10) {
    return 'Member number Toys Kingdom tidak ditemukan'
  }
}

export default { updateConstraints, addressConstraints, redeemPointConstraints, getPointConstraints, memberGroupAHIConstraints, memberGroupHCIConstraints, memberGroupTGIConstraints }
