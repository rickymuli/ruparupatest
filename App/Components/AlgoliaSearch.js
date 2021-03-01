// import React from 'react'
// import { View, Text } from 'react-native'
// import { InstantSearch, Configure } from 'react-instantsearch-native'

const AlgoliaSearch = ({ productHandler }) => null
// {
//   const { algolia, canGoSend, minPrice, maxPrice } = productHandler
//   const { colors, brands, labels } = algolia
//   const keyword = itmData?.keyword ?? itemDetail.search

//   convertQuery = (result, items, key) => {
//     let newResult = result
//     filter += ' AND ('
//     items.forEach((item, i, key) => {
//       newResult += `${key}:${item}`
//       if (i !== items.length - 1) filter += ' OR '
//     })
//     newResult += ')'
//     return newResult
//   }

//   const filterData = useMemo(() => {
//     let filter = 'status:10'
//     if (!_.isEmpty(colors)) convertQuery(filter, colors, 'colour')
//     if (!_.isEmpty(brands)) {
//       filter += ' AND ('
//       filter += brands.reduce((res, value, i, arr) => `${key}:${item}${(i !== items.length - 1) ? ' OR ' : ')'}`, '')
//     }
//     if (!_.isEmpty(canGoSend)) {
//       filter += ' AND ('
//       if (canGoSend === '1') filter += `can_gosend:sameday)`
//       else if (canGoSend === '2') filter += `can_gosend:instant)`
//       else if (canGoSend === '1,2') filter += `can_gosend:sameday OR can_gosend:instant)`
//     }
//     if (!_.isEmpty(labels)) convertQuery(filter, labels, 'label.ODI')
//     if (!_.isEmpty(minPrice)) filter += ` AND selling_price > ${Number(minPrice)}`
//     if (!_.isEmpty(maxPrice)) filter += ` AND selling_price < ${Number(maxPrice)}`
//     return filter
//   }, [productHandler])
//   return (
//     <InstantSearch
//       searchClient={algoliasearch(config.apiIndexAlgolia, config.apiKeyAlgolia)}
//       indexName='productsvariant'>
//       <Configure query={keyword} filters={filterData} clickAnalytics />
//       <AlgoliaPcpInfiniteHits productHandler={productHandler} filter={filter} productInformation={productInformation} keyword={keyword} />
//     </InstantSearch>
//   )
// }

export default AlgoliaSearch
