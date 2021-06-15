/**
 * The external imports
 */
import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { formulationLabel } from '@/Utils/Formulations/FormulationLabel'
import { translate } from '@/Translations/algorithm'
import { Config } from '@/Config'
import { useTheme } from '@/Theme'

const Capsule = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const { Gutters, Fonts } = useTheme()

  const { t } = useTranslation()

  let every = ''

  if (drug.formulationSelected !== null) {
    every = `${t('formulations.drugs.every')} ${24 / drugDose.doses_per_day} ${t('formulations.drugs.h')} ${drug.duration} ${t('formulations.drugs.days')}`
  }

  return (
    <View>
      <Text>{formulationLabel(drugDose)}</Text>
      <Text style={Fonts.textSmall}>
        {t('formulations.drug.d')}: {drug.duration}
      </Text>
      {drug.formulationSelected !== null && (
        <Text style={Fonts.textSmall}>
          {t('formulations.drug.admin')}: {drugDose.administration_route_name}
        </Text>
      )}
      {drug.formulationSelected !== null && <Text>{every}</Text>}
      <Text style={[Gutters.regularTMargin, Fonts.textSmall]}>
        {translate(drugDose.dispensing_description)}
      </Text>
      {Config.ADMINISTRATION_ROUTE_CATEGORIES.includes(drugDose.administration_route_category) ? <Text key={`text_${drug.id}`}>{translate(drugDose.injection_instructions)}</Text> : null}
    </View>
  )
}

export default Capsule
