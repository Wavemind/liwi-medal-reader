import { buildSlice } from '@thecodingmachine/redux-toolkit-wrapper'
import ChangeVersion from './ChangeVersion'

const sliceInitialState = {
  item: {},
  versionId: null,
}

export default buildSlice('system', [ChangeVersion], sliceInitialState).reducer
