/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import {
  SummaryFinalDiagnoses,
  SummaryQuestions,
  PatientTabBar,
} from '@/Components'
import { translate } from '@/Translations/algorithm'
import { ReadableDate } from '@/Utils'

const SummaryWrapperMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const Tab = createMaterialTopTabNavigator()
  const { Layout, Gutters, Fonts } = useTheme()

  const patient = useSelector(state => state.patient.item)
  const medicalCase = useSelector(state => state.medicalCase.item)

  // Get gender
  const genderNodeId = useSelector(
    state => state.algorithm.item.config.basic_questions.gender_question_id,
  )
  const genderAnswerId = patient.patientValues.find(
    patientValue => patientValue.node_id === genderNodeId,
  ).answer_id
  const gender = useSelector(
    state => state.algorithm.item.nodes[genderNodeId].answers[genderAnswerId],
  )

  return (
    <View style={Layout.fill}>
      <View style={[Layout.row, Gutters.smallHMargin, Gutters.smallVMargin]}>
        <View style={[Layout.fill, Layout.column, Gutters.tinyRMargin]}>
          <View style={[Layout.row]}>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall]}>{t('patient.first_name')}</Text>
            </View>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
                {patient.first_name}
              </Text>
            </View>
          </View>
          <View style={[Layout.row]}>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall]}>{t('patient.last_name')}</Text>
            </View>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
                {patient.last_name}
              </Text>
            </View>
          </View>
          <View style={[Layout.row]}>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall]}>{t('patient.gender')}</Text>
            </View>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
                {translate(gender.label)}
              </Text>
            </View>
          </View>
          <View style={[Layout.row]}>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall]}>{t('patient.birth_date')}</Text>
            </View>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
                {format(patient.birth_date, 'dd.MM.yyyy')}
              </Text>
            </View>
          </View>
        </View>
        <View style={[Layout.fill, Layout.column, Gutters.tinyLMargin]}>
          <View style={[Layout.row]}>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall]}>key</Text>
            </View>
            <View style={[Layout.fill, Layout.column]}>
              <Text style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}>
                value
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Tab.Navigator
        tabBarOptions={{ scrollEnabled: true }}
        tabBar={tabProps => <PatientTabBar {...tabProps} />}
      >
        <Tab.Screen
          name="FinalDiagnoses"
          component={SummaryFinalDiagnoses}
          options={{
            title: t('navigation.final_diagnoses'),
          }}
        />
        <Tab.Screen
          name="Questions"
          component={() => (
            <View style={[Gutters.smallHMargin, Gutters.smallVMargin]}>
              <View style={[Layout.row]}>
                <View style={[Layout.fill, Layout.column]}>
                  <Text style={[Fonts.textSmall]}>
                    {t('containers.medical_case.summary.date_consultation')}
                  </Text>
                </View>
                <View style={[Layout.fill, Layout.column]}>
                  <Text
                    style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}
                  >
                    {format(medicalCase.createdAt, 'dd.MM.yyyy')}
                  </Text>
                </View>
              </View>
              <View style={[Layout.row]}>
                <View style={[Layout.fill, Layout.column]}>
                  <Text style={[Fonts.textSmall]}>
                    {t('containers.medical_case.summary.age_date_consultation')}
                  </Text>
                </View>
                <View style={[Layout.fill, Layout.column]}>
                  <Text
                    style={[Fonts.textSmall, Fonts.textBold, Fonts.textRight]}
                  >
                    {ReadableDate(medicalCase.createdAt, patient.birth_date)}
                  </Text>
                </View>
              </View>
              <SummaryQuestions />
            </View>
          )}
          options={{
            title: t('navigation.questions'),
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default SummaryWrapperMedicalCaseContainer
