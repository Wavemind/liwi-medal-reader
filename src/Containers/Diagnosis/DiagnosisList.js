/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import * as _ from 'lodash'

/**
 * The internal imports
 */
import {
  SelectionBar,
  LoaderList,
  Icon,
  SectionHeader,
  Autosuggest,
} from '@/Components'
import { useTheme } from '@/Theme'
import DiagnosisItem from '@/Containers/Diagnosis/DiagnosisItem'
import ChangeAdditionalDiagnosis from '@/Store/MedicalCase/ChangeAdditionalDiagnosis'
import { hp } from '@/Theme/Responsive'

const ListPatientContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Containers: { diagnosisList },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const additionalDiagnosis = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  // Local state definition
  const [data, setData] = useState([])
  const [selected, setSelected] = useState(additionalDiagnosis)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const finalDiagnosticsList = _.filter(algorithm.nodes, {
      type: 'FinalDiagnostic',
    })
    setData(finalDiagnosticsList)
  }, [])

  useEffect(() => {
    filterList()
  }, [searchTerm])

  /**
   * Load more patients
   */
  const loadMore = () => {
    console.log('TODO: load more')
    setData(data.concat([11, 12, 13, 14, 15]))
  }

  const filterList = () => {
    const finalDiagnosticsList = _.filter(algorithm.nodes, {
      type: 'FinalDiagnostic',
    })
    const filteredDiagnosisList = _.filter(finalDiagnosticsList, diagnosis => diagnosis.label.en.includes(searchTerm))
    setData(filteredDiagnosisList)
  }

  /**
   * Toggles the additional diagnostic selection in the store
   * @param checkboxValue
   * @param nodeId
   */
  const toggleAdditionalDiagnosis = (checkboxValue, nodeId) => {
    const tempAdditionalDiagnosis = [...selected]
    const index = tempAdditionalDiagnosis.indexOf(nodeId)
    if (index > -1) {
      tempAdditionalDiagnosis.splice(index, 1)
    } else {
      tempAdditionalDiagnosis.push(nodeId)
    }
    setSelected(tempAdditionalDiagnosis)
  }

  /**
   * Updates the global store when the user is done selecting elements
   */
  const handleClose = () => {
    dispatch(
      ChangeAdditionalDiagnosis.action({
        newAdditionalDiagnosis: selected,
      }),
    )
    navigation.goBack()
  }

  return (
    <View style={diagnosisList.wrapper}>
      <View style={diagnosisList.headerWrapper}>
        <Text style={diagnosisList.header}>
          {t('containers.diagnosis.title')}
        </Text>
        <TouchableOpacity style={diagnosisList.closeButton} onPress={handleClose}>
          <Icon name="close" color={Colors.secondary} />
        </TouchableOpacity>
      </View>
      <Autosuggest searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <SelectionBar
        handleRemovePress={toggleAdditionalDiagnosis}
        selected={selected}
        setSelected={setSelected}
      />

      <SectionHeader label="Diagnosis" />

      <FlatList
        data={data}
        // TODO Fix this shit
        style={{ height: hp(69) }}
        renderItem={({ item }) => (
          <DiagnosisItem
            selected={selected}
            item={item}
            handlePress={toggleAdditionalDiagnosis}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<LoaderList />}
        // onEndReached={() => loadMore()}
        // onEndReachedThreshold={0.1}
      />
    </View>
  )
}

export default ListPatientContainer
