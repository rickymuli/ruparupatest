const UrlParser = ({ url }) => {
  if (url && url.includes('?')) {
    let result = {}
    const splitted = url.split('?')
    if (splitted.length <= 1) return null

    const query = JSON.parse('{"' + decodeURI(splitted[1].replace(/&/g, `","`).replace(/=/g, `":"`)) + '"}') // turn query into literal object to be passed as param
    result['baseUrl'] = splitted[0]
    result['query'] = query
    result['urlKey'] = result['baseUrl'].replace('https://www.ruparupa.com/', '')
    return result
  }
}

export const urlToObject = (url) => {
  return url
    .substring(url.indexOf('?') + 1)
    .split('&')
    .reduce((memo, param) => (
      {
        ...memo,
        [param.split('=')[0]]: param.split('=')[1]
      })
    , {})
}

export default UrlParser
