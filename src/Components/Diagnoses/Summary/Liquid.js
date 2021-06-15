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
import { roundSup } from '@/Utils/Formulations/RoundSup'
import { translate } from '@/Translations/algorithm'
import { administrationRouteCategories } from '@/Utils/Formulations/Constants'
import { useTheme } from '@/Theme'

const Liquid = ({ drug, drugDose }) => {
  // Theme and style elements deconstruction
  const { Gutters, Fonts } = useTheme()

  const { t } = useTranslation()

  const ratio = drugDose.liquid_concentration / drugDose.dose_form

  return (
    <View>
      <Text style={Fonts.textSmall}>{formulationLabel(drugDose)}</Text>
      {drugDose.by_age ? (
        <Text style={Fonts.textSmall}>{`${roundSup(drugDose.unique_dose)}ml ${t('formulations.medication_form.per_administration')} ${t('formulations.drug.during')} ${drug.duration} ${t('formulations.drug.days')}`}</Text>
      ) : drugDose.doseResult === null ? (
        <Text style={Fonts.textSmall}>{drugDose.no_possibility}</Text>
      ) : (
        <View>
          <Text style={Fonts.textSmall}>
            {t('formulations.drug.give')} {ratio * drugDose.doseResult}
            {t('formulations.drug.mg')}: {drugDose.doseResult}
            {t('formulations.drug.ml')} {t('formulations.drug.of')} {drugDose.liquid_concentration}
            {t('formulations.drug.mg')}/{drugDose.dose_form}
            {t('formulations.drug.ml')}
          </Text>
          <Text style={Fonts.textSmall}>{`${t('formulations.drug.every')} ${drugDose.recurrence} ${t('formulations.drug.h')} ${drug.duration} ${t('formulations.drug.days')}`}</Text>
          <Text style={[Gutters.regularTMargin, Fonts.textSmall]}>
            {translate(drugDose.dispensing_description)}
          </Text>
        </View>
      )}
      {administrationRouteCategories.includes(drugDose.administration_route_category) ? <Text style={Fonts.textSmall} key={`text_${drug.id}`}>{translate(drugDose.injection_instructions)}</Text> : null}
    </View>
  )
}

export default Liquid
