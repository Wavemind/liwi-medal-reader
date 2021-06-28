/**
 * The external imports
 */
import uuid from 'react-native-uuid'
import faker from 'faker'

/**
 * The internal imports
 */

export default async props => {
  const { facility, otherFacility, newMedicalCase } = props
  const { study_id, uid, group_id } = facility

  return {
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_date_estimated: false,
    consent: true,
    consent_file: null,
    createdAt: new Date().getTime() / 1000, // Transform ms to s
    fail_safe: false,
    group_id,
    id: uuid.v4(),
    medicalCases: [],
    other_group_id: otherFacility.group_id || null,
    other_study_id: otherFacility.study_id || null,
    other_uid: otherFacility.uid || null,
    patient_values: [],
    reason: null,
    savedInDatabase: !newMedicalCase, // TODO check if we can set false directly
    study_id,
    uid,
    updatedAt: new Date().getTime() / 1000, // Transform ms to s
  }
}
