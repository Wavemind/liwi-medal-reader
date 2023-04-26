/**
 * The external imports
 */
import { createAction } from '@reduxjs/toolkit'
import i18n from '@/Translations/index'

export default {
  initialState: {},
  action: createAction('healthFacility/changeClinician'),
  reducers(state, { payload }) {
    state.clinician = payload.clinician

    i18n.changeLanguage(payload.clinician.app_language)
  },
}
