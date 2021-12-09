/**
 * The external imports
 */
import { Model } from '@nozbe/watermelondb'
import { date, field, relation } from '@nozbe/watermelondb/decorators'

export default class ActivityModel extends Model {
  static table = 'activities'

  static associations = {
    medicalCases: { type: 'belongs_to', key: 'medical_case_id' },
  }

  @field('step') step
  @field('clinician') clinician
  @field('nodes') nodes
  @field('mac_address') mac_address // TODO REMOVE IN NEXT RELEASE
  @field('device_id') device_id
  @field('medical_case_id') medical_case_id
  @date('synchronized_at') synchronized_at
  @field('fail_safe') fail_safe
  @date('created_at') createdAt

  @relation('medical_cases', 'medical_case_id') medicalCase
}
