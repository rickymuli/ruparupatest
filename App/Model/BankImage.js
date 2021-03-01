const BankImage = (props) => {
  let urlImage = ''
  switch (props) {
    case 'BNI':
      urlImage = require('../assets/images/bankInstallment/bni.webp')
      break
    case 'BCA':
      urlImage = require('../assets/images/bankInstallment/bca.webp')
      break
    case 'BRI':
      urlImage = require('../assets/images/bankInstallment/bri.webp')
      break
    case 'Bukopin':
      urlImage = require('../assets/images/bankInstallment/bukopin.webp')
      break
    case 'Citibank':
      urlImage = require('../assets/images/bankInstallment/citi.webp')
      break
    case 'CIMB':
      urlImage = require('../assets/images/bankInstallment/cimb.webp')
      break
    case 'Danamon':
      urlImage = require('../assets/images/bankInstallment/danamon.webp')
      break
    case 'HSBC':
      urlImage = require('../assets/images/bankInstallment/hsbc.webp')
      break
    case 'Mandiri':
      urlImage = require('../assets/images/bankInstallment/mandiri.webp')
      break
    case 'OCBC':
      urlImage = require('../assets/images/bankInstallment/ocbc.webp')
      break
    case 'Panin':
      urlImage = require('../assets/images/bankInstallment/panin.webp')
      break
    case 'Permata':
      urlImage = require('../assets/images/bankInstallment/permata.webp')
      break
    case 'Digibank':
      urlImage = require('../assets/images/bankInstallment/digibank.webp')
      break
    case 'Standchart':
      urlImage = require('../assets/images/bankInstallment/standchart.webp')
      break
    case 'MEGA':
      urlImage = require('../assets/images/bankInstallment/mega.webp')
      break
    case 'Maybank':
      urlImage = require('../assets/images/bankInstallment/maybank.webp')
      break
    default:
      urlImage = require('../assets/images/bankInstallment/transparant-image.webp')
      break
  }
  return urlImage
}

export default BankImage
