/**
 * The external imports
 */
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */

export default async props => {
  const { facility, otherFacility } = props
  const { study_id, uid, group_id } = facility
  const { other_study_id, other_uid, other_group_id } = otherFacility

  return {
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_date_estimated: false,
    consent: false,
    consent_file: null,
    createdAt: new Date().getTime() / 1000, // Transform ms to s
    fail_safe: false,
    group_id,
    id: uuid.v4(),
    medicalCases: [],
    other_group_id: other_group_id || null,
    other_study_id: other_study_id || null,
    other_uid: other_uid || null,
    patient_values: [],
    reason: null,
    study_id,
    uid,
    updatedAt: new Date().getTime() / 1000, // Transform ms to s
  }
}
