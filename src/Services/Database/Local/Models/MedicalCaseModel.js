/**
 * The external imports
 */
import { Model } from '@nozbe/watermelondb'
import {
  date,
  field,
  relation,
  json,
  children,
} from '@nozbe/watermelondb/decorators'

/**
 * The internal imports
 */
const sanitizeJson = val => val

export default class MedicalCase extends Model {
  static table = 'medical_cases'

  static associations = {
    activities: { type: 'has_many', key: 'medical_case_id' },
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @children('activities') activities
  @relation('patients', 'patient_id') patient
  // https://nozbe.github.io/WatermelonDB/Advanced/AdvancedFields.html?highlight=json#json
  @json('json', sanitizeJson) json
  @field('stage') stage
  @field('step') step
  @field('json_version') json_version
  @field('patient_id') patient_id
  @field('version_id') version_id
  @field('fail_safe') fail_safe
  @date('synchronized_at') synchronizedAt
  @date('closed_at') closedAt
  @date('created_at') createdAt
  @date('updated_at') updatedAt
}
