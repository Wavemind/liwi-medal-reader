/**
 * The external imports
 */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Drug } from '@/Components'

const Drugs = ({ diagnosis }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const [keys] = useState(['agreed', 'additional'])

  /**
   * Sorts the drugs by level_of_urgency
   * @returns {*}
   */
  const sortDrugsByUrgency = key =>
    orderBy(
      Object.values(diagnosis.drugs[key]),
      drug => nodes[drug.id].level_of_urgency,
      ['desc', 'asc'],
    )

  return (
    <View>
      <View style={[Layout.rowHCenter, Layout.justifyContentBetween]}>
        <Text style={summary.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
      </View>
      {Object.keys(diagnosis.drugs.agreed).length +
        Object.keys(diagnosis.drugs.additional).length ===
      0 ? (
        <Text style={finalDiagnoses.noItemsText}>
          {t('containers.medical_case.drugs.no_medicines')}
        </Text>
      ) : (
        keys.map(key =>
          sortDrugsByUrgency(key).map((drug, i) => (
            <Drug
              key={`summary_diagnosis_drugs-${drug.id}`}
              drug={drug}
              diagnosisId={diagnosis.id}
              isLast={i === Object.keys(diagnosis.drugs[key]).length - 1}
            />
          )),
        )
      )}
    </View>
  )
}

export default Drugs
