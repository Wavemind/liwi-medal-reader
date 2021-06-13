/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { translate } from '@/Translations/algorithm'
import FormulationsPicker from '@/Containers/MedicalCase/FormulationsPicker'

const Formulations = ({}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Fonts,
    Layout,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()

  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  const [drugs, setDrugs] = useState([])

  useEffect(() => {
    const newDrugs = [...drugs]
    const keys = ['additional', 'agreed']

    keys.forEach(key => {
      Object.values(diagnoses[key]).forEach(diagnosis => {
        keys.forEach(k => {
          Object.values(diagnosis.drugs[k]).forEach(drug => {
            if (!newDrugs.some(d => d.drugId === drug.id)) {
              const drugFormulations = nodes[drug.id].formulations
              newDrugs.push({
                drugId: drug.id,
                relatedDiagnoses: [diagnosis.id],
                selectedFormulationId:
                  drugFormulations.length === 1 ? drugFormulations[0].id : null,
              })
            } else {
              newDrugs
                .find(d => d.drugId === drug.id)
                .relatedDiagnoses.push(diagnosis.id)
            }
          })
        })
      })
    })
    setDrugs(newDrugs)
  }, [diagnoses])

  /**
   * Updates the formulations in the local state
   * @param index
   * @param value
   */
  const updateFormulations = (index, value) => {
    const newDrugs = [...drugs]
    newDrugs[index].selectedFormulationId = value
    setDrugs(newDrugs)
  }

  return (
    <ScrollView>
      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>
            {t('containers.medical_case.formulations.title')}
          </Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {drugs.map((drug, i) => {
            return (
              <View style={formulations.drugWrapper(i === drugs.length - 1)}>
                <View style={[Layout.row, Layout.justifyContentBetween]}>
                  <View style={formulations.leftColumn}>
                    <Text style={[Fonts.textSmall, Fonts.textBold]}>
                      {translate(nodes[drug.drugId].label)}
                    </Text>
                    {drug.relatedDiagnoses.map(relatedDiagnosisId => (
                      <Text style={Fonts.textSmall}>
                        - {translate(nodes[relatedDiagnosisId].label)}
                      </Text>
                    ))}
                  </View>
                  <View style={formulations.rightColumn}>
                    <View style={formulations.pickerWrapper}>
                      <FormulationsPicker
                        drug={drug}
                        index={i}
                        updateFormulations={updateFormulations}
                      />
                    </View>
                  </View>
                </View>
                {drug.selectedFormulationId && (
                  <Text style={formulations.selectedFormulationText}>
                    {translate(
                      nodes[drug.drugId].formulations.find(
                        f => f.id === drug.selectedFormulationId,
                      ).description,
                    )}
                  </Text>
                )}
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default Formulations
