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
import { QuestionInfoButton } from '@/Components'

const Management = ({ management, isLast }) => {
  const { t } = useTranslation()
  const {
    Gutters,
    Fonts,
    Containers: { summary },
  } = useTheme()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  /**
   * Display indication
   * @returns jsx
   */
  const indicationDisplay = () =>
    management.relatedDiagnoses
      .map(finalDiagnose => translate(nodes[finalDiagnose.diagnosisId].label))
      .join(', ')

  return (
    <View
      style={summary.managementWrapper(
        isLast,
        nodes[management.id].is_referral,
      )}
    >
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        <View style={summary.drugTitleWrapper}>
          <Text style={summary.drugTitle}>
            {translate(nodes[management.id].label)}
          </Text>
          {(translate(nodes[management.id].description) !== '' ||
            nodes[management.id].medias?.length > 0) && (
            <QuestionInfoButton nodeId={management.id} />
          )}
        </View>
        <>
          <Text style={summary.drugText}>
            <Text style={Fonts.textBold}>
              {t('formulations.drug.indication')}:
            </Text>{' '}
            {indicationDisplay()}
          </Text>
        </>
      </View>
    </View>
  )
}

export default Management
