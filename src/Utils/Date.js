/**
 * The external imports
 */
import format from 'date-fns/format'

export const formatDate = date => {
  return format(date, 'dd.MM.yyyy')
}

export const formatDateTime = date => {
  return format(date, 'dd.MM.yyyy - HH:mm')
}
