/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import authStyles from './containers/Auth/Auth.style'
import authLoginStyles from './containers/Auth/Login.style'
import authSynchronizationStyles from './containers/Auth/Synchronization.style'
import authPinStyles from './containers/Auth/Pin.style'
import startupIndexStyles from './containers/Startup/Index.style'

/**
 *
 * @props Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function (props) {
  return {
    auth: authStyles(props),
    authLogin: authLoginStyles(props),
    authSynchronization: authSynchronizationStyles(props),
    authPin: authPinStyles(props),
    startupIndex: startupIndexStyles(props),
  }
}
