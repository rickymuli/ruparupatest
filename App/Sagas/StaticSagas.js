import StaticActions, { StaticTypes } from '../Redux/StaticRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'

// listen to action
export function * fetchStaticServer (api) {
  yield baseListen(StaticTypes.STATIC_SERVER,
    fetchStaticPageAPI,
    api)
}

// attempts to fetch Static page
export function * fetchStaticPageAPI (api, data) {
  yield baseFetchNoToken(api.getStaticPage,
    data,
    StaticActions.staticSuccess,
    StaticActions.staticFailure)
}
