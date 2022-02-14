import { getStoredState } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

export default async config => {
  return getStoredState(config).catch(err => {
    return getStoredState({ ...config, storage: AsyncStorage })
  })
}
