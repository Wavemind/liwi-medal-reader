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
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { SectionHeader, RoundedButton } from '@/Components'
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { translate } from '@/Translations/algorithm'
import ChangeAdditionalDiagnoses from '@/Store/MedicalCase/ChangeAdditionalDiagnoses'
import ChangeCustomDiagnoses from '@/Store/MedicalCase/ChangeCustomDiagnoses'
import ChangeAgreedDiagnoses from '@/Store/MedicalCase/ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from '@/Store/MedicalCase/ChangeRefusedDiagnoses'

const RegistrationMedicalCaseContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Gutters,
    FontSize,
    Containers: { medicalCaseDiagnoses },
    Components: { booleanButton },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const { proposed, custom, additional, agreed, refused } = useSelector(
    state => state.medicalCase.item.diagnosis,
  )

  // TODO remove this once we have some proposed and changed all tempProposed to proposed
  const tempProposed = [...proposed]
  tempProposed.push(60)
  tempProposed.push(76)

  const [value, setValue] = useState('')
  const [formattedProposed, setFormattedProposed] = useState(
    tempProposed.map(item => {
      let answer = null
      if (Object.keys(agreed).includes(item.toString())) {
        answer = true
      } else if (refused.includes(item)) {
        answer = false
      }
      return { id: item, answer: answer }
    }),
  )

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosis
   * @returns {JSX.Element}
   */
  const renderBooleanButton = diagnosis => {
    const buttons = [
      {
        side: 'left',
        answer: true,
        text: t('containers.medical_case.diagnoses.agree'),
      },
      {
        side: 'right',
        answer: false,
        text: t('containers.medical_case.diagnoses.disagree'),
      },
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
      ChangeAdditionalDiagnoses.action({
        newAdditionalDiagnoses: tempAdditionalDiagnoses,
      }),
    )
  }

  /**
   * Handles whether to add or remove a custom diagnosis from the store
   * @param action
   * @param customDiagnosisId
   */
  const changeCustomDiagnosis = (action = 'add', customDiagnosisId = null) => {
    const tempCustomDiagnoses = [...custom]

    if (action === 'remove') {
      const index = tempCustomDiagnoses
        .map(customDiagnosis => customDiagnosis.id)
        .indexOf(customDiagnosisId)
      if (index > -1) {
        tempCustomDiagnoses.splice(index, 1)
      }
    } else {
      const newCustomDiagnosis = {
        id: uuid.v4(),
        name: value,
        drugs: [],
      }
      tempCustomDiagnoses.push(newCustomDiagnosis)
      setValue('')
    }

    dispatch(
      ChangeCustomDiagnoses.action({
        newCustomDiagnoses: tempCustomDiagnoses,
      }),
    )
  }

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param proposedDiagnosisId
   * @param val
   */
  const updateProposedDiagnosis = (proposedDiagnosisId, val) => {
    setFormattedProposed(
      formattedProposed.map(el =>
        el.id === proposedDiagnosisId ? { ...el, answer: val } : el,
      ),
    )
    const tempAgreedDiagnoses = { ...agreed }
    const tempRefusedDiagnoses = [...refused]
    const isInAgreed = Object.keys(tempAgreedDiagnoses).includes(
      proposedDiagnosisId.toString(),
    )
    const isInRefused = tempRefusedDiagnoses.includes(proposedDiagnosisId)

    if (val && !isInAgreed) {
      tempAgreedDiagnoses[proposedDiagnosisId] = {
        id: proposedDiagnosisId.toString(),
        drugs: {},
      }
      dispatch(
        ChangeAgreedDiagnoses.action({
          newAgreedDiagnoses: tempAgreedDiagnoses,
        }),
      )

      if (isInRefused) {
        tempRefusedDiagnoses.splice(
          tempRefusedDiagnoses.indexOf(proposedDiagnosisId),
          1,
        )
        dispatch(
          ChangeRefusedDiagnoses.action({
            newRefusedDiagnoses: tempRefusedDiagnoses,
          }),
        )
      }
    }

    if (!val && !isInRefused) {
      tempRefusedDiagnoses.push(proposedDiagnosisId)
      dispatch(
        ChangeRefusedDiagnoses.action({
          newRefusedDiagnoses: tempRefusedDiagnoses,
        }),
      )
      if (isInAgreed) {
        delete tempAgreedDiagnoses[proposedDiagnosisId.toString()]
        dispatch(
          ChangeAgreedDiagnoses.action({
            newAgreedDiagnoses: tempAgreedDiagnoses,
          }),
        )
      }
    }
  }

  return (
    <ScrollView style={Gutters.regularHPadding}>
      <SectionHeader
        label={t('containers.medical_case.diagnoses.proposed_title', {
          version_name: algorithm.version_name,
        })}
      />
      {formattedProposed.map((proposedDiagnosis, i) => {
        return (
          <View
            key={`proposed-${proposedDiagnosis.id}`}
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
        <SectionHeader
          label={t('containers.medical_case.diagnoses.additional_title')}
        />
        {additional.map((additionalDiagnosisId, i) => {
          return (
            <View
              key={`additional-${additionalDiagnosisId}`}
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
          onPress={() => navigation.navigate('Diagnoses')}
        >
          <Text style={medicalCaseDiagnoses.addAdditionalButtonText}>
            {t('containers.medical_case.diagnoses.additional_placeholder')}
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
        <SectionHeader
          label={t('containers.medical_case.diagnoses.custom_title')}
        />
        {custom.map((customDiagnosis, i) => {
          return (
            <View
              key={`custom-${customDiagnosis.id}`}
              style={medicalCaseDiagnoses.newItemWrapper(
                i === custom.length - 1,
              )}
            >
              <Text>{customDiagnosis.name}</Text>
              <TouchableOpacity
                onPress={() =>
                  changeCustomDiagnosis('remove', customDiagnosis.id)
                }
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
            placeholder={t(
              'containers.medical_case.diagnoses.custom_placeholder',
            )}
          />
          <RoundedButton
            label="Add"
            icon="add"
            filled
            fullWidth={false}
            iconSize={FontSize.large}
            onPress={() => changeCustomDiagnosis()}
            disabled={value === ''}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default RegistrationMedicalCaseContainer
