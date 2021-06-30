import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'

import { FetchOneHealthFacilityService } from '@/Services/HealthFacility'

export default {
  initialState: buildAsyncState('fetchOne'),
  action: buildAsyncActions(
    'healthFacility/fetchOne',
    FetchOneHealthFacilityService,
  ),
  reducers: buildAsyncReducers({
    errorKey: 'fetchOne.error',
    loadingKey: 'fetchOne.loading',
  }),
}
