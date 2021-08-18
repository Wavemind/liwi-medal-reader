/**
 * The external imports
 */
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import fr from 'date-fns/locale/fr'
import enGB from 'date-fns/locale/en-GB'

/**
 * The internal imports
 */
import { store } from '@/Store'

/**
 * Change display of patient date follow those rules
 * Creation date of medical case - patient date of birth
 *
 * Rules
 * < 7 days | display age in days -> 6 days old
 * >= 7 days < 31 days | display age in weeks ex: lower rounding 3.5 weeks become 3 weeks -> 3 weeks old
 * >= 31 days < 730 | display age in months (1 month = 30.4375) ex: Lower rounding 3.5 months become 3 months -> 3 months old
 * >= 24 month | display age in years ex: Lower rounding 3.5 year -> 3 years old
 *
 * @returns [String] human readable date
 */
export default (from, to) => {
  const state = store.getState()
  const systemLanguage = state.system.language
  let locale = enGB

  if (systemLanguage === 'fr') {
    locale = fr
  }

  return formatDistanceStrict(from, to, { locale })
}
