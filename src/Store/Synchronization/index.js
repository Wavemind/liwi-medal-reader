import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import Synchronize from './Synchronize'

export default buildSlice('synchronization', [Synchronize]).reducer
