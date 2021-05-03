/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import authIndexStyles from './containers/Auth/Index.style'

/**
 *
 * @props Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function (props) {
  return {
    authIndex: authIndexStyles(props),
  }
}
