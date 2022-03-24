/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { drugIsAgreed } from '@/Utils/Drug'
import {
  FormulationsPicker,
  DrugBooleanButton,
  QuestionInfoButton,
} from '@/Components'

const ProposedDrugs = ({ proposedDrugs }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { formulations, drugs },
  } = useTheme()
  const { t } = useTranslation()

  const orderedDrug = orderBy(proposedDrugs, drug => drug.levelOfUrgency, [
    'desc',
  ])

  return (
    <View style={drugs.wrapper}>
      <View style={drugs.headerWrapper}>
        <Text style={drugs.header}>
          {t('containers.medical_case.drugs.proposed')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {orderedDrug.map((drug, i) => (
          <View
            key={`proposedDrug_${drug.id}`}
            style={drugs.innerWrapper(
              i === Object.values(proposedDrugs).length - 1,
            )}
          >
            <View style={drugs.drugTitleWrapper}>
              <Text style={drugs.drugTitle}>{drug.label}</Text>
              <QuestionInfoButton nodeId={drug.id} />
              <DrugBooleanButton drug={drug} />
            </View>

            <Text style={drugs.indication}>
              {t('containers.medical_case.drugs.indication')}
            </Text>
            {drug.diagnoses.map(diagnosis => (
              <Text
                key={`diagnosisDrug_${diagnosis.id}`}
                style={drugs.drugDescription}
              >
                - {diagnosis.label}
              </Text>
            ))}
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
