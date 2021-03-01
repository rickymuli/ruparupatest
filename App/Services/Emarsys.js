import Emarsys from 'react-native-emarsys-wrapper'

export const setContact = async (customerId) => {
  try {
    await Emarsys.setContact(customerId)
  } catch (e) {
    console.log(e)
  }
}

export const clearContact = async () => {
  try {
    await Emarsys.clearContact()
  } catch (e) {
    console.log(e)
  }
}

export const trackCart = async (cart, pdpAddToCartItem = null) => {
  try {
    let data = []
    cart.map(item => {
      item.details.map(product => {
        const unit = product.qty_ordered
        data.push({ itemId: product.sku, unit, price: product.prices.selling_price * unit })
      })
    })
    if (pdpAddToCartItem) data = [...data, pdpAddToCartItem]
    await Emarsys.predict.trackCart(data)
  } catch (e) {
    console.log(e)
  }
}

export const trackEmptyCart = async () => {
  try {
    await Emarsys.predict.trackCart([])
  } catch (e) {
    console.log(e)
  }
}

export const trackPurchase = async (orderId, cart) => {
  try {
    let data = []
    cart.map(item => {
      item.details.map(product => {
        const quantity = product.qty_ordered
        data.push({ itemId: product.sku, quantity, price: product.prices.selling_price * quantity })
      })
    })
    await Emarsys.predict.trackPurchase(orderId, data)
  } catch (e) {
    console.log(e)
  }
}

export const trackItemView = async (id) => {
  try {
    await Emarsys.predict.trackItemView(id)
  } catch (e) {
    console.log(JSON.stringify(e))
  }
}

export const trackRecommendationClick = async (data) => {
  try {
    await Emarsys.predict.trackRecommendationClick({ ...data, customFields: {} })
  } catch (e) {
    console.log(e)
  }
}

export const cartProductRecommendation = async (cartList) => {
  try {
    let data = []
    cartList.map(item => {
      item.details.map(product => data.push({ itemId: product.sku, price: product.selling_price, quantity: product.qty_ordered }))
    })
    const result = await Emarsys.predict.recommendProductsCartItems('CART', data)
    return result
  } catch (e) {
    console.log(e)
  }
}

export const homepageCategoryRecommendation = async () => {
  try {
    const result = await Emarsys.predict.recommendProductsLimit('HOME', 1)
    return result
  } catch (e) {
    console.log(e)
  }
}

export const homepageProductRecommendation = async () => {
  try {
    const result = await Emarsys.predict.recommendProductsLimit('PERSONAL', 40)
    return result
  } catch (e) {
    console.log(e)
  }
}

export const emarsysObjectHelper = item => {
  let linkUrl = item.linkUrl.split('/')
  return {
    name: item.title,
    url_key: linkUrl[linkUrl.length - 1],
    variants: [{
      images: [{
        image_url: item.imageUrl
      }],
      prices: [{
        price: item.msrp,
        special_price: (item.price === item.msrp) ? null : item.price
      }],
      sku: item.productId
    }],
    brand: {
      name: item.brand
    }
  }
}
