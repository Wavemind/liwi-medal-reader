/**
 * The external imports
 */
import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class PatientValue extends Model {
  static table = 'patient_values'

  static associations = {
    patients: { type: 'belongs_to', foreignKey: 'patient_id' },
  }

  @relation('patients', 'patient_id') patient

  @field('patient_id') patient_id
  @field('node_id') node_id
  @field('answer_id') answer_id
  @field('value') value
  @field('fail_safe') fail_safe
}
