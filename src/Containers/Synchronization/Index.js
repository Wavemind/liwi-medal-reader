/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { Text, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { SectionHeader } from '@/Components'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'

const IndexSynchronizationContainer = props => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Containers: { global },
    Layout,
    Gutters,
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  /**
   * Send medical cases to main data
   * @returns {Promise<void>}
   */
  // const synchronize = async () => {
  // const writePermission = await askWriteStorage()
  // if (writePermission) {
  //   const { medicalCasesToSynch, mainDataURL } = this.state
  //   const {
  //     app: { t, database },
  //   } = this.props
  //   this.setState({ isLoading: true })
  //   const folder = `${DocumentDirectoryPath}/medical_cases`
  //   const targetPath = `${folder}.zip`
  //   // Create directory
  //   await mkdir(folder)
  //   // Generate files
  //   await Promise.all(
  //     medicalCasesToSynch.map(async medicalCase => {
  //       const patient = await database.localInterface.findBy(
  //         'Patient',
  //         medicalCase.patient_id,
  //       )
  //       const patientAll = await database.localInterface.getAll(
  //         'Patient',
  //         null,
  //         null,
  //         true,
  //       )
  //       const activitiesDB = await medicalCase.activities
  //       const activities = await Promise.all(
  //         activitiesDB.map(activity => new ActivityModel(activity)),
  //       )
  //       const medicalCaseJson = JSON.stringify(
  //         {
  //           ...JSON.parse(medicalCase.json),
  //           patient: { ...patient, medicalCases: [] },
  //           activities,
  //         },
  //         (key, value) => (typeof value === 'undefined' ? null : value),
  //       )
  //       await writeFile(`${folder}/${medicalCase.id}.json`, medicalCaseJson)
  //     }),
  //   )
  //   // Generate archive
  //   const path = await zip(normalizeFilePath(folder), targetPath).catch(
  //     error => {
  //       this.setState({ isLoading: false })
  //     },
  //   )
  //   await Promise.all(
  //     medicalCasesToSynch.map(async medicalCase => {
  //       await unlink(`${folder}/${medicalCase.id}.json`)
  //     }),
  //   )
  //   const result = await synchronizeMedicalCases(mainDataURL, path)
  //   if (result !== null && result.data_received) {
  //     // Reset medicalCases to sync if request success
  //     medicalCasesToSynch.forEach(medicalCase => {
  //       database.localInterface.update('MedicalCase', medicalCase.id, {
  //         synchronized_at: moment().unix(),
  //       })
  //     })
  //     this.setState({ isLoading: false, error: '', medicalCasesToSynch: [] })
  //   } else {
  //     this.setState({
  //       isLoading: false,
  //       error: t('synchronize:error'),
  //       medicalCasesToSynch,
  //     })
  //   }
  // }
  // }

  return (
    <Animated.View
      style={[Layout.fill, global.animation(fadeAnim), Gutters.regularHMargin]}
    >
      <SectionHeader label={t('containers.synchronization.title')} />
      <View style={[Layout.center, Layout.fill]}>
        <Text>Medical cases not being synchronized yet </Text>
        <Text style={{ fontSize: 140 }}>0</Text>
      </View>
    </Animated.View>
  )
}

export default IndexSynchronizationContainer
