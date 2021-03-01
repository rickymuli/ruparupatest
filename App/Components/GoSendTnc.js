import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import HTML from 'react-native-render-html'
import htmlStyles from '../Styles/RNHTMLStyles'
import { Container, FontSizeM, Bold } from '../Styles/StyledComponents'

export default class GoSendTnc extends Component {
  render () {
    const freeDeliveryHtml =
    `<ol>
    <li>Gratis ongkir <strong>hingga Rp 20.000</strong> berlaku untuk setiap checkout dengan metode pengiriman GoSend Same Day & Instant Delivery ke <strong>Pulau Jawa, Bali, Sumatera, Sulawesi Kalimantan*</strong></li>
    <li>Berlaku untuk pembelian produk yang bertanda Same Day & Instant Delivery dan Instant Delivery</li>
    <li>Berlaku dengan <strong>minimum transaksi Rp 200.000</strong> untuk produk dengan metode pengiriman GoSend Same Day & Instant Delivery</li>
    <li>Login atau register akun Anda di Ruparupa dan masukkan kode voucher <strong>GRATISONGKIR</strong> saat checkout</li>
    <li>Produk Anda dapat dikirimkan dari toko yang berbeda tergantung dari ketersediaan produk. Satu driver GOJEK hanya dapat mengirimkan produk dari 1 toko (<strong>ACE/Informa/Toys Kingdom/Pet Kingdom/Chatime</strong>) yang sama</li>
    <li>Tidak berlaku penggabungan minimum transaksi dengan produk yang dikirim menggunakan metode pengiriman reguler</li>
    <li>Tidak berlaku penggabungan minimum transaksi dengan produk yang diambil di toko</li>
    <li>Tidak berlaku untuk pembelian produk Flash Sale dan tidak dapat digabungkan dengan kode promo lainnya</li>
    <li>Gratis Ongkir akan hangus jika pengiriman pertama gagal karena pelanggan tidak ada ditempat dan tidak dapat dihubungi saat pengiriman oleh kurir</li>
  </ol>`
    const gosendTncHtml =
    `
  <ol>
    <li>Pelanggan harus mencantumkan nomor telepon yang valid pada profil, serta memasukkan titik koordinat alamat pengiriman ketika checkout</li>
    <li>Pesanan Anda akan dikirimkan dari toko&nbsp;<strong>ACE/Informa/Toys Kingdom/Pet Kingdom/Chatime&nbsp;</strong>yang berada di area:
    <ul style="list-style-type: circle;">
    <li><strong>Jabodetabek</strong> (Sebagian wilayah Jakarta, Bogor, Depok, Tangerang, dan Bekasi)</li>
    <li><strong>Jawa Barat</strong> (Sebagian wilayah Karawang, Cirebon, Kota Bandung, Tasikmalaya)</li>
    <li><strong>Jawa Tengah&nbsp;</strong>(Sebagian wilayah Semarang, Purwokerto, dan Tegal)</li>
    <li><strong><strong>Jawa Timur&nbsp;</strong></strong>(Sebagian wilayah Gresik, Kediri, Malang, dan Surabaya)</li>
    <li><strong>Sebagian wilayah Yogyakarta</strong></li>
    <li><strong>Bali&nbsp;</strong>(Denpasar &amp; Kuta)</li>
    <li><strong>Sulawesi&nbsp;</strong>(Sebagian wilayah Makassar, Manado dan Maluku)</li>
    <li><strong>Sumatera&nbsp;</strong>(Sebagian wilayah Lampung, Medan dan Palembang)</li>
    <li><strong>Kalimantan&nbsp;</strong>(Sebagian wilayah Banjarmasin, Pekanbaru)</li>
    </ul>
    </li>
    <li>
    <div>Produk Anda dapat dikirimkan dari toko yang berbeda tergantung dari ketersediaan produk. Satu driver GOJEK hanya dapat mengirimkan produk dari 1 toko <strong>(ACE/Informa/Toys Kingdom/Pet Kingdom/Chatime)</strong> yang sama.</div>
    </li>
    <li>Wilayah pengiriman saat ini hanya tersedia untuk area&nbsp;<strong>Pulau Jawa, Bali, Sumatera, Sulawesi, Kalimantan*</strong></li>
    <li>Jarak maksimal pengiriman dengan GO-SEND adalah&nbsp;<strong>40 km</strong></li>
    <li>Seluruh pengiriman akan mulai diproses pukul 12:00 waktu setempat setiap harinya</li>
    <li>Transaksi yang dilakukan di Hari Sabtu - Minggu dan Hari Libur Nasional akan diproses pada hari berikutnya</li>
    <li>Tersedia 2 (dua) jenis layanan GoSend:</li>
    </ol>
    <strong>Instant Delivery</strong>
    <ul>
    <li>Pengiriman Instant akan dikirimkan dihari yang sama apabila pembayaran telah dilakukan sebelum pukul 15.59 WIB</li>
    <li>Estimasi waktu pengiriman maksimal 3 jam setelah proses Pick Up</li>
    <li>Ukuran maksimum pengiriman barang untuk Instant Delivery adalah 70cm (Panjang) x 70cm (Lebar) x 50cm (Tinggi) dan berat maksimal 20kg</li>
    </ul>
    <strong>Sameday Delivery</strong>
    <ul>
    <li>Pengiriman Same Day akan dikirimkan dihari yang sama apabila pembayaran telah dilakukan sebelum pukul 12.59 WIB</li>
    <li>Estimasi waktu pengiriman maksimal 6-8 jam setelah proses Pick Up</li>
    <li>Ukuran maksimum pengiriman barang untuk dan Same Day Delivery adalah 40cm (Panjang) x 40cm (Lebar) x 17cm (Tinggi) dan berat maksimal 5kg</li>
    </ul>
    `
    return (
      <View>
        <Container>
          <View style={{ marginTop: 10 }}>
            <FontSizeM><Bold>Syarat & Ketentuan Mendapatkan Gratis Ongkir GO-SEND</Bold></FontSizeM>
          </View>
          <HTML
            html={freeDeliveryHtml}
            imagesMaxWidth={Dimensions.get('screen').width * 0.45}
            tagsStyles={htmlStyles.HTMLPDPTagStyles}
          />
          <View style={{ marginTop: 10 }}>
            <FontSizeM><Bold>Syarat & Ketentuan pengiriman dengan GO-SEND</Bold></FontSizeM>
          </View>
          <HTML
            html={gosendTncHtml}
            imagesMaxWidth={Dimensions.get('screen').width * 0.45}
            tagsStyles={htmlStyles.HTMLPDPTagStyles}
          />
        </Container>
      </View>
    )
  }
}
