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
    activities: { type: 'has_many', foreignKey: 'medical_case_id' },
    patients: { type: 'belongs_to', foreignKey: 'patient_id' },
  }

  /**
   * Check if case can be synchronized with main data
   * @returns {boolean}
   */
  canBeSynchronized = algorithm => {
    // const json = JSON.parse(this.json)
    // return (
    //   this.status === Config.MEDICAL_CASE_STATUS.close.label &&
    //   this.synchronized_at === null &&
    //   json.isEligible &&
    //   json.isOldEnough &&
    //   (json.consent || !algorithm.config.consent_management)
    // )
  }

  /**
   * Test if medicalCase is older than 7 days
   * @returns {boolean}
   */
  isOlderThan1Week = () => {
    // return moment().diff(this.created_at, 'days') > 7
  }

  /**
   * Get value of medical case value
   * @param nodeId
   * @param algorithm
   * @returns {string}
   */
  getLabelFromNode = (nodeId, algorithm) => {
    // let displayedValue = ''
    // const currentNode = algorithm.nodes[nodeId]
    // const { nodes } = JSON.parse(this.json)
    // const mcNode = nodes[nodeId]
    // if (currentNode !== undefined) {
    //   if (currentNode.display_format === Config.DISPLAY_FORMAT.date) {
    //     // Date display
    //     displayedValue = moment(mcNode.value).format(
    //       I18n.t('application:date_format'),
    //     )
    //   } else if (mcNode.value === null) {
    //     // Answer display
    //     displayedValue = mcNode.answer
    //   } else {
    //     displayedValue = mcNode.value
    //   }
    // }
    // return displayedValue
  }

  @children('activities') activities
  @relation('patients', 'patient_id') patient

  // https://nozbe.github.io/WatermelonDB/Advanced/AdvancedFields.html?highlight=json#json
  @json('json', sanitizeJson) json
  @field('synchronized_at') synchronized_at
  @field('patient_id') patient_id
  // /@field('status') status
  @field('fail_safe') fail_safe
  @date('created_at') createdAt
  @date('updated_at') updatedAt
}
