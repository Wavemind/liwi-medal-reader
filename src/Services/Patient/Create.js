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
    consent: false,
    consent_file: null,
    created_at: new Date(),
    fail_safe: false,
    group_id,
    id: uuid.v4(),
    medical_cases: [],
    other_group_id: other_group_id || null,
    other_study_id: other_study_id || null,
    other_uid: other_uid || null,
    patient_values: [],
    reason: null,
    study_id,
    uid,
    updated_at: new Date(),
  }
}
