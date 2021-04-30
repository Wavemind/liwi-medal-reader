import {
  buildAsyncState,
  buildAsyncReducers,
  buildAsyncActions,
} from '@thecodingmachine/redux-toolkit-wrapper'
import newSessionUserService from '@/Services/User/NewSession'
import DeviceRegister from '@/Store/Device/Register'

export default {
  initialState: buildAsyncState('newSession'),
  action: buildAsyncActions('user/newSession', async (args, { dispatch }) => {
    // Auth user
    const newSessionLoading = await newSessionUserService(args)

    // Register device in medAl-Creator
    await dispatch(DeviceRegister.action({}))

    return newSessionLoading
  }),
  reducers: buildAsyncReducers({
    errorKey: 'newSession.error',
    loadingKey: 'newSession.loading',
  }),
}
