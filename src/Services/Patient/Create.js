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
    first_name: __DEV__ ? faker.name.firstName() : '',
    last_name: __DEV__ ? faker.name.lastName() : '',
    birth_date: null,
    birth_date_estimated: false,
    birth_date_estimated_type: null,
    consent: true,
    consent_file: null,
    createdAt: new Date().getTime(),
    fail_safe: false,
    group_id,
    id: uuid.v4(),
    medicalCases: [],
    other_group_id: otherFacility.group_id || null,
    other_study_id: otherFacility.study_id || null,
    other_uid: otherFacility.uid || null,
    patientValues: [],
    reason: null,
    savedInDatabase: !newMedicalCase,
    study_id,
    uid,
    updatedAt: new Date().getTime(),
  }
}
