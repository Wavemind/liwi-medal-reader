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
      console.log(medicalStaff)
      if (medicalStaff.id === state.clinician.id) {
        console.log('Je rentre')
        return {
          ...medicalStaff,
          [payload.key]: payload.newLanguage,
        }
      }
      return medicalStaff
    })

    console.log('juste avant', {
      ...state,
      clinician: {
        ...state.clinician,
        [payload.key]: payload.newLanguage,
      },
      item: {
        ...state.item,
        medical_staffs: medicalStaffs,
      },
    })

    state.item = {
      ...state.item,
      medical_staffs: medicalStaffs,
    }
  },
}
