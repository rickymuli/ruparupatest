import isEmpty from 'lodash/isEmpty'

const addressConstraints = (data) => {
  const { province, city, kecamatan } = data
  if (isEmpty(province.province_id)) {
    return 'Provinsi tidak boleh kosong'
  } else {
    if (!isNaN(province.province_id)) {
      return 'Terjadi kesalahan, ulangi beberapa saat lagi'
    }
  }
  if (isEmpty(city.city_id)) {
    return 'Kota tidak boleh kosong'
  } else {
    if (!isNaN(city.city_id)) {
      return 'Terjadi kesalahan, ulangi beberapa saat lagi'
    }
  }
  if (isEmpty(kecamatan.kecamatan_id)) {
    return 'Kecamatan tidak boleh kosong'
  } else {
    if (!isNaN(kecamatan.kecamatan_id)) {
      return 'Terjadi kesalahan, ulangi beberapa saat lagi'
    }
  }
}

export default {
  addressConstraints
}
