/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import globalStyles from './containers/Global/Index.style'

import authStyles from './containers/Auth/Auth.style'
import authLoginStyles from './containers/Auth/Login.style'
import authSynchronizationStyles from './containers/Auth/Synchronization.style'
import authPinStyles from './containers/Auth/Pin.style'
import authClinicianSelectionStyles from './containers/Auth/ClinicianSelection.style.js'

import startupIndexStyles from './containers/Startup/Index.style'

import ModalIndexStyles from './containers/Modal/Index.style'
import ModalAlgorithmStyles from './containers/Modal/AlgorithmInfo.style'

import SettingsIndexStyles from './containers/Settings/Index.style'

/**
 *
 * @props Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function (props) {
  return {
    global: globalStyles(props),
    auth: authStyles(props),
    authLogin: authLoginStyles(props),
    authSynchronization: authSynchronizationStyles(props),
    authPin: authPinStyles(props),
    authClinicianSelection: authClinicianSelectionStyles(props),
    startupIndex: startupIndexStyles(props),
    modalIndex: ModalIndexStyles(props),
    modalAlgorithm: ModalAlgorithmStyles(props),
    settings: SettingsIndexStyles(props),
  }
}
