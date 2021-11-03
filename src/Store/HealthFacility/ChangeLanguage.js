import { createAction } from '@reduxjs/toolkit'

export default {
  initialState: {},
  action: createAction('healthFacility/changeLanguage'),
  reducers(state, { payload }) {
    // Update current clinician value
    state.clinician = {
      ...state.clinician,
      [payload.key]: payload.newLanguage,
    }

    // Update in medical staffs list given by server
    const medicalStaffs = state.item.medical_staffs.map(medicalStaff => {
      if (medicalStaff.id === state.clinician.id) {
        return {
          ...medicalStaff,
          [payload.key]: payload.newLanguage,
        }
      }
      return medicalStaff
    })

    state.item = {
      ...state.item,
      medical_staffs: medicalStaffs,
    }
  },
}
