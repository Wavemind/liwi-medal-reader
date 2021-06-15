/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const DiagnosisSummaryDrugs = ({ diagnosis }) => {
  // Theme and style elements deconstruction
  const {
    Fonts,
    Layout,
    Containers: { finalDiagnoses, summary },
  } = useTheme()

  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  const managementsCount = diagnosis.managements.length

  return (
    <View>
      <View style={[Layout.rowHCenter, Layout.justifyContentBetween]}>
        <Text style={summary.drugsHeader}>
          {t('containers.medical_case.summary.management_consulting')}
        </Text>
      </View>
      {managementsCount === 0 ? (
        <Text style={finalDiagnoses.noItemsText}>{t('containers.medical_case.summary.no_managements')}</Text>
      ) : (
        diagnosis.managements.map((managementId, i) => (
          <View style={summary.drugWrapper(i === managementsCount - 1)}>
            <Text style={Fonts.textSmall}>
              {translate(nodes[diagnosis.id].managements[managementId].description)}
            </Text>
          </View>
        ))
      )}
    </View>
  )
}

export default DiagnosisSummaryDrugs
