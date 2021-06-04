/**
 * The external imports
 */
import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import filter from 'lodash/filter'

/**
 * The internal imports
 */
import { Question, SectionHeader } from '@/Components'
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { translate } from '@/Translations/algorithm'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Layout,
    Gutters,
    FontSize,
    Fonts,
    Containers: { diagnosisList },
  } = useTheme()

  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const { proposed, custom, additional } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  const removeAdditionalDiagnosis = nodeId => {
    const tempAdditionalDiagnoses = [...additional]

    const index = tempAdditionalDiagnoses.indexOf(nodeId)
    if (index > -1) {
      tempAdditionalDiagnoses.splice(index, 1)
    }

    dispatch(
      ChangeAdditionalDiagnosis.action({
        newAdditionalDiagnosis: tempAdditionalDiagnoses,
      }),
    )
  }

  const removeCustomDiagnosis = customDiagnosis => {
    console.log('remove custom diagnosis')
  }

  return (
    <View style={Gutters.regularHPadding}>
      <SectionHeader
        label={`Diagnoses proposed by ${algorithm.version_name}`}
      />
      <View style={Gutters.largeTMargin}>
        <SectionHeader label="Additional Selected" />
        {additional.map(additionalDiagnosisId => {
          return (
            <View
              style={{
                ...Gutters.regularHPadding,
                ...Gutters.regularVPadding,
                ...Layout.rowHCenter,
                ...Layout.justifyContentBetween,
                borderBottomColor: Colors.grey,
                borderBottomWidth:
                  additional.slice(-1)[0] === additionalDiagnosisId ? 0 : 1,
              }}
            >
              <Text>
                {translate(algorithm.nodes[additionalDiagnosisId].label)}
              </Text>
              <TouchableOpacity
                onPress={() => removeAdditionalDiagnosis(additionalDiagnosisId)}
              >
                <Icon style={{}} name="delete" size={FontSize.regular} />
              </TouchableOpacity>
            </View>
          )
        })}
        <TouchableOpacity
          style={{
            ...Gutters.smallTMargin,
            ...Gutters.tinyVPadding,
            ...Gutters.regularHPadding,
            ...Layout.row,
            backgroundColor: Colors.secondary,
            borderColor: Colors.grey,
            borderWidth: 1,
            borderRadius: 20,
          }}
          onPress={() => props.navigation.navigate('Diagnoses')}
        >
          <Text
            style={{
              ...Fonts.textSmall,
              ...Layout.grow,
            }}
          >
            Select your diagnosis
          </Text>
          <View
            style={{
              ...Layout.rowVCenter,
              backgroundColor: Colors.primary,
              borderRadius: 14,
              width: 28,
              height: 28,
            }}
          >
            <Text
              style={{
                ...Fonts.textSmall,
                color: Colors.secondary,
              }}
            >
              {additional.length}
            </Text>
          </View>
          <Icon
            style={Gutters.regularLMargin}
            name="right-arrow"
            size={FontSize.large}
          />
        </TouchableOpacity>
      </View>
      <View style={Gutters.largeTMargin}>
        <SectionHeader label="Your proposition" />
        {custom.map(customDiagnosis => {
          return (
            <View
              style={{
                ...Gutters.regularHPadding,
                ...Gutters.regularVPadding,
                ...Layout.rowHCenter,
                ...Layout.justifyContentBetween,
                borderBottomColor: Colors.grey,
                borderBottomWidth:
                  additional.slice(-1)[0] === customDiagnosis ? 0 : 1,
              }}
            >
              <Text>{customDiagnosis}</Text>
              <TouchableOpacity
                onPress={() => removeCustomDiagnosis(customDiagnosis)}
              >
                <Icon style={{}} name="delete" size={FontSize.regular} />
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default RegistrationMedicalCaseContainer
