/**
 * The external imports
 */
import React, { useMemo } from 'react'
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

const CalculatedDrugs = ({ calculatedDrugs }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Containers: { medicines },
  } = useTheme()
  const { t } = useTranslation()

  const orderedDrugs = useMemo(
    () => orderBy(calculatedDrugs, drug => drug.levelOfUrgency, ['desc']),
    [calculatedDrugs],
  )

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.drugs.proposed')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {orderedDrugs.map((drug, i) => (
          <View
            key={`calculatedDrugs-${drug.id}`}
            style={medicines.innerWrapper(
              i === Object.values(calculatedDrugs).length - 1,
            )}
          >
            <View style={medicines.drugTitleWrapper}>
              <Text style={medicines.drugTitle}>{drug.label}</Text>
              <QuestionInfoButton nodeId={drug.id} />
              <DrugBooleanButton drug={drug} />
            </View>

            <Text style={medicines.indication}>
              {t('containers.medical_case.drugs.indication')}
            </Text>
            {drug.diagnoses.map(diagnosis => (
              <Text
                key={`diagnosisDrug_${diagnosis.id}`}
                style={medicines.drugDescription}
              >
                - {diagnosis.label}
              </Text>
            ))}
            {drugIsAgreed(drug) && (
              <View style={medicines.pickerWrapper}>
                <FormulationsPicker drug={drug} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

export default CalculatedDrugs
