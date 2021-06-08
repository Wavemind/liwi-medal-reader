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

  /**
   * Check if case can be synchronized with main data
   * @returns {boolean}
   */
  // canBeSynchronized = algorithm => {
  // const json = JSON.parse(this.json)
  // return (
  //   this.status === Config.MEDICAL_CASE_STATUS.close.label &&
  //   this.synchronized_at === null &&
  //   json.isEligible &&
  //   json.isOldEnough &&
  //   (json.consent || !algorithm.config.consent_management)
  // )
  //}

  /**
   * Test if medicalCase is older than 7 days
   * @returns {boolean}
   */
  // isOlderThan1Week = () => {
  // return moment().diff(this.created_at, 'days') > 7
  //}

  @children('activities') activities
  @relation('patients', 'patient_id') patient
  // https://nozbe.github.io/WatermelonDB/Advanced/AdvancedFields.html?highlight=json#json
  @json('json', sanitizeJson) json
  @json('advancement', sanitizeJson) advancement
  @field('synchronized_at') synchronized_at
  @field('patient_id') patient_id
  @field('fail_safe') fail_safe
  @date('created_at') createdAt
  @date('updated_at') updatedAt
}
