import NavigationFilterActions, { NavigationFilterTypes } from '../Redux/NavigationFilterRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'

export function * getNavigationFilter (api) {
  yield baseListen(NavigationFilterTypes.FILTER_REQUEST,
    fetchNavigationFilterAPI,
    api)
}

export function * fetchNavigationFilterAPI (api, data) {
  yield baseFetchNoToken(api.getNavigationFilter,
    data,
    NavigationFilterActions.filterSuccess,
    NavigationFilterActions.filterFailure)
}
