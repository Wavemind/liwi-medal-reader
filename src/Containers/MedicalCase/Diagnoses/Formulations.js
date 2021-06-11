/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { translate } from '@/Translations/algorithm'
import {wp} from "@/Theme/Responsive";
import {Select} from "@/Components";

const Formulations = ({}) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Colors,
    Fonts,
    Layout,
    Containers: { formulations },
  } = useTheme()

  const { t } = useTranslation()

  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  const drugs = []
  const keys = ['additional', 'agreed']
  keys.forEach(key => {
    Object.values(diagnoses[key]).forEach(diagnosis => {
      Object.values(diagnosis.drugs[key]).forEach(drug => {
        if (!drugs.includes(drug.id)) {
          drugs.push(drug.id)
        }
      })
      Object.values(diagnosis.drugs.agreed).forEach(drug => {
        if (!drugs.includes(drug.id)) {
          drugs.push(drug.id)
        }
      })
    })
  })

  console.log(nodes)

  return (
    <ScrollView>
      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>
            Which formulation of medicine is available and appropriate for your
            patient ?
          </Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {drugs.map((drugId, i) => {
            return (
              <View style={[Gutters.smallVMargin, Gutters.smallVPadding, { borderBottomWidth: i === drugs.length - 1 ? 0 : 1, borderBottomColor: Colors.grey }]}>
                <View style={[Layout.row]}>
                  <View style={[{ width: wp(40) }]}>
                    <Text style={[Fonts.textSmall, Fonts.textBold]}>{translate(nodes[drugId].label)}</Text>
                    <Text>- Uncomplicated Malaria</Text>
                    <Text>- Acute diarrhea</Text>
                  </View>
                  <View style={[{ width: wp(40) }]}>
                    {/*{TODO put the select here }*/}
                  </View>
                </View>
                <Text style={[Fonts.textTiny, Fonts.textBold, Gutters.tinyVMargin]}>20mg artemether / 120 mg lumefantrine (weight 15 to > 25kg)</Text>
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

export default Formulations
