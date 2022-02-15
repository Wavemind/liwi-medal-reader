/**
 * The external imports
 */
import differenceInDays from 'date-fns/differenceInDays'

/**
 * The internal imports
 */
import i18n from '@/Translations/index'

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
  const ageInDays = differenceInDays(new Date(from), to)

  let readableDate = ''

  if (ageInDays < 7) {
    readableDate = i18n.t('patient.readable_birth_date.days', {
      value: ageInDays,
    })
  }

  if (ageInDays >= 7 && ageInDays < 31) {
    readableDate = i18n.t('patient.readable_birth_date.weeks', {
      value: Math.floor(ageInDays / 7),
    })
  }

  /* https://wavemind.atlassian.net/jira/software/c/projects/LIWI/boards/8/backlog?view=detail&selectedIssue=LIWI-1668&issueLimit=100 */
  if (ageInDays >= 31 && ageInDays < 730) {
    readableDate = i18n.t('patient.readable_birth_date.months', {
      value: Math.floor(ageInDays / 30),
    })
  }

  if (ageInDays >= 730) {
    readableDate = i18n.t('patient.readable_birth_date.years', {
      value: ageInDays === 730 ? ageInDays / 365 : Math.floor(ageInDays / 365),
    })
  }

  return readableDate
}
