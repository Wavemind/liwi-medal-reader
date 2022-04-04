/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'

export default unsortedArray =>
  unsortedArray.sort((a, b) => {
    if (translate(a.label) > translate(b.label)) {
      return 1
    } else {
      if (translate(b.label) > translate(a.label)) {
        return -1
      }
      return 0
    }
  })
