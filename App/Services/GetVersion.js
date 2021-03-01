import config from '../../config.js'
import { Platform } from 'react-native'
export const getVersion = () => {
  let stg = config.developmentENV === 'stg'
  let version = ''
  if (Platform.OS === 'ios') {
    version = stg ? `${config.versionStgIos} ${config.stgProject}` : `${config.versionIos} ${config.versionCodePushIos}`
  } else {
    version = stg ? `${config.versionStgAndroid} ${config.stgProject}` : `${config.versionAndroid} ${config.versionCodePushAndroid}`
  }
  return `Versi ${version}`
}
export default getVersion
