/**
 * The external imports
 */
import React, { useState } from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { SectionHeader, RoundedButton } from '@/Components'
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { translate } from '@/Translations/algorithm'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'
import ChangeCustomDiagnosis from '@/Store/MedicalCase/ChangeCustomDiagnosis'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Gutters,
    FontSize,
    Containers: { medicalCaseDiagnoses },
    Components: { booleanButton },
  } = useTheme()

  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const { proposed, custom, additional } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  // TODO remove this once we have some proposed and changed all tempProposed to proposed
  const tempProposed = [...proposed]
  tempProposed.push(60)
  tempProposed.push(76)

  const [value, setValue] = useState('')
  const [formattedProposed, setFormattedProposed] = useState(
    tempProposed.map(item => ({ id: item, answer: null })),
  )

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosis
   * @returns {JSX.Element}
   */
  const renderBooleanButton = diagnosis => {
    const buttons = [
      { side: 'left', answer: true, text: 'Agree' },
      { side: 'right', answer: false, text: 'Disagree' },
    ]

    return (
      <View style={medicalCaseDiagnoses.booleanButtonWrapper}>
        {buttons.map(button => {
          const selected = diagnosis.answer === button.answer
          return (
            <View
              key={`booleanButton-${button.side}`}
              style={booleanButton.buttonWrapper(button.side, selected)}
            >
              <TouchableOpacity
                style={Layout.center}
                onPress={() =>
                  updateProposedDiagnosis(diagnosis.id, button.answer)
                }
              >
                <Text style={booleanButton.buttonText(selected)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    )
  }

  /**
   * Removes a single element from the additional diagnosis list
   * @param additionalDiagnosisId
   */
  const removeAdditionalDiagnosis = additionalDiagnosisId => {
    const tempAdditionalDiagnoses = [...additional]

    const index = tempAdditionalDiagnoses.indexOf(additionalDiagnosisId)
    if (index > -1) {
      tempAdditionalDiagnoses.splice(index, 1)
    }

    dispatch(
      ChangeAdditionalDiagnosis.action({
        newAdditionalDiagnosis: tempAdditionalDiagnoses,
      }),
    )
  }

  /**
   * Removes a single element from the custom diagnosis list
   * @param customDiagnosisId
   */
  const removeCustomDiagnosis = customDiagnosisId => {
    // TODO see if we can merge the remove and add methods
    const tempCustomDiagnoses = [...custom]

    const index = tempCustomDiagnoses
      .map(customDiagnosis => customDiagnosis.id)
      .indexOf(customDiagnosisId)
    if (index > -1) {
      tempCustomDiagnoses.splice(index, 1)
    }

    dispatch(
      ChangeCustomDiagnosis.action({
        newCustomDiagnosis: tempCustomDiagnoses,
      }),
    )
  }

  /**
   * Adds a new element to the custom diagnosis list
   */
  const addCustomDiagnosis = () => {
    if (value.length > 0) {
      const tempCustomDiagnoses = [...custom]
      const newCustomDiagnosis = {
        id: uuid.v4(),
        name: value,
        drugs: [],
      }
      tempCustomDiagnoses.push(newCustomDiagnosis)

      dispatch(
        ChangeCustomDiagnosis.action({
          newCustomDiagnosis: tempCustomDiagnoses,
        }),
      )

      setValue('')
    }
  }

  const updateProposedDiagnosis = (proposedDiagnosisId, val) => {
    setFormattedProposed(
      formattedProposed.map(el =>
        el.id === proposedDiagnosisId ? { ...el, answer: val } : el,
      ),
    )
    // TODO save the agreed proposed in the right format in the store
    // TODO save the refused proposed in the right format in the store
  }

  return (
    <ScrollView style={Gutters.regularHPadding}>
      <SectionHeader
        label={`Diagnoses proposed by ${algorithm.version_name}`}
      />
      {formattedProposed.map((proposedDiagnosis, i) => {
        return (
          <View
            style={medicalCaseDiagnoses.newItemWrapper(
              i === tempProposed.length - 1,
            )}
          >
            <Text>
              {translate(algorithm.nodes[proposedDiagnosis.id].label)}
            </Text>
            {renderBooleanButton(proposedDiagnosis)}
          </View>
        )
      })}
      <View style={Gutters.largeTMargin}>
        <SectionHeader label="Additional Selected" />
        {additional.map((additionalDiagnosisId, i) => {
          return (
            <View
              style={medicalCaseDiagnoses.newItemWrapper(
                i === additional.length - 1,
              )}
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
          style={medicalCaseDiagnoses.addAdditionalButton}
          onPress={() => props.navigation.navigate('Diagnoses')}
        >
          <Text style={medicalCaseDiagnoses.addAdditionalButtonText}>
            Select your diagnosis
          </Text>
          <View style={medicalCaseDiagnoses.addAdditionalButtonCountWrapper}>
            <Text style={medicalCaseDiagnoses.addAdditionalButtonCountText}>
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
        {custom.map((customDiagnosis, i) => {
          return (
            <View
              style={medicalCaseDiagnoses.newItemWrapper(
                i === custom.length - 1,
              )}
            >
              <Text>{customDiagnosis.name}</Text>
              <TouchableOpacity
                onPress={() => removeCustomDiagnosis(customDiagnosis.id)}
              >
                <Icon style={{}} name="delete" size={FontSize.regular} />
              </TouchableOpacity>
            </View>
          )
        })}
        <View style={medicalCaseDiagnoses.addCustomWrapper}>
          <TextInput
            style={medicalCaseDiagnoses.addCustomInputText}
            onChangeText={setValue}
            value={value}
            keyboardType="default"
            placeholder="Add you diagnosis"
          />
          <RoundedButton
            label="Add"
            icon="add"
            filled
            fullWidth={false}
            iconSize={FontSize.large}
            onPress={() => addCustomDiagnosis()}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default RegistrationMedicalCaseContainer
