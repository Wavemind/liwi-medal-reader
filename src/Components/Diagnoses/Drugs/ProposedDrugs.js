/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { reworkAndOrderDrugs, drugIsAgreed } from '@/Utils/Drug'
import {
  FormulationsPicker,
  DrugBooleanButton,
  QuestionInfoButton,
} from '@/Components'

const ProposedDrugs = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { formulations, drugs },
  } = useTheme()
  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)

  const proposedDrugs = useMemo(
    () => reworkAndOrderDrugs('proposed'),
    [diagnoses],
  )

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>
          {t('containers.medical_case.drugs.proposed')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {proposedDrugs.map((drug, i) => (
          <View
            style={drugs.innerWrapper(
              i === Object.values(proposedDrugs).length - 1,
            )}
          >
            <View style={drugs.drugTitleWrapper}>
              <Text style={drugs.drugTitle}>
                {translate(nodes[drug.id].label)}
              </Text>
              <QuestionInfoButton nodeId={drug.id} />
              <DrugBooleanButton drug={drug} />
            </View>

            <View>
              <Text style={drugs.indication}>
                {t('containers.medical_case.drugs.indication')}
              </Text>
              {drug.diagnoses.map(diagnosis => (
                <Text style={drugs.drugDescription}>
                  - {translate(nodes[diagnosis.id].label)}
                </Text>
              ))}
            </View>
            {drugIsAgreed(drug) && (
              <View style={formulations.pickerWrapper}>
                <FormulationsPicker drug={drug} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

export default ProposedDrugs
