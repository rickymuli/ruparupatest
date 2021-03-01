const URIDecoder = (url) => {
  const route = url.replace(/.*?:\/\//g, '') // remove http or https from url
  const routeArr = route.split('/') // split base url and route name ['baseUrl', '/routeName?query=query']
  const routeQuery = routeArr[1].split('?') // get query from url
  const routeParam = JSON.parse('{"' + decodeURI(routeQuery[1].replace(/&/g, `","`).replace(/=/g, `":"`)) + '"}') // turn query into literal object to be passed as param
  return { routeName: routeQuery[0], routeParam } // { routeName: 'shopee', routeParam: { order: 'ODI123', voucher: 'SHPRRE } }
}

export default URIDecoder
