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
  const { other_study_id, other_uid, other_group_id } = otherFacility

  return {
    first_name: __DEV__ ? faker.name.firstName() : '',
    last_name: __DEV__ ? faker.name.lastName() : '',
    birth_date: '',
    birth_date_estimated: false,
    consent: true,
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
    reason: null, // DO THIS SHIT ALAIN
    savedInDatabase: !newMedicalCase, // TODO check if we can set false directly
    study_id,
    uid,
    updatedAt: new Date().getTime() / 1000, // Transform ms to s
  }
}
