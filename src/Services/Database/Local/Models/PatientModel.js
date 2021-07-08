/**
 * The external imports
 */
import { Model } from '@nozbe/watermelondb'
import { date, field, children } from '@nozbe/watermelondb/decorators'

export default class Patient extends Model {
  static table = 'patients'

  static associations = {
    medical_cases: { type: 'has_many', foreignKey: 'patient_id' },
    patient_values: { type: 'has_many', foreignKey: 'patient_id' },
  }

  @children('medical_cases') medicalCases
  @children('patient_values') patientValues

  @field('id') id
  @field('first_name') first_name
  @field('last_name') last_name
  @date('birth_date') birth_date
  @field('birth_date_estimated') birth_date_estimated
  @field('birth_date_estimated_type') birth_date_estimated_type
  @field('uid') uid
  @field('study_id') study_id
  @field('group_id') group_id
  @field('other_uid') other_uid
  @field('other_study_id') other_study_id
  @field('other_group_id') other_group_id
  @field('reason') reason
  @field('consent') consent
  @field('consent_file') consent_file
  @field('fail_safe') fail_safe
  @date('created_at') createdAt
  @date('updated_at') updatedAt
}
