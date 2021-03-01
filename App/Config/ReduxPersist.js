import immutablePersistenceTransform, { reducedStateHydrate } from '../Services/ImmutablePersistenceTransform'
import AsyncStorage from '@react-native-async-storage/async-storage'

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.3',
  storeConfig: {
    key: 'ruparupa',
    storage: AsyncStorage,
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ['login', 'search', 'nav'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ['auth', 'storeNewRetail', 'user', 'category', 'home', 'inspiration', 'cart', 'prevSearch'],
    transforms: [immutablePersistenceTransform],
    // redux-persist ^5 need implement manual reconciler to make immutable state work
    stateReconciler: reducedStateHydrate
  }
}

export default REDUX_PERSIST
