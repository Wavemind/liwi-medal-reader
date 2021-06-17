import UpdateField from '@/Store/Patient/UpdateField'
import HandleComplaintCategories from '@/Store/MedicalCase/HandleComplaintCategories'
import HandleDateFormulas from '@/Store/MedicalCase/HandleDateFormulas'

/**
 * Set a birth date to the patient used for tes purpose
 * @param {store} store : the store
 * @param {Date} birthDate : the birth date you want to set
 */
export const setBirthDate = async (store, birthDate) => {
  const algorithm = store.getState().algorithm.item
  await store.dispatch(
    UpdateField.action({
      field: 'birth_date',
      value: birthDate.getTime(),
    }),
  )
  // Trigger formulas related to birth date
  await store.dispatch(
    HandleDateFormulas.action({
      birthDate: birthDate.getTime(),
      algorithm,
    }),
  )
  // Set default value for complain category
  await store.dispatch(
    HandleComplaintCategories.action({
      birthDate: birthDate.getTime(),
      algorithm,
    }),
  )
}
