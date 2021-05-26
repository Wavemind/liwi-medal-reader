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

import modalIndexStyles from './containers/Modal/Index.style'
import modalAlgorithmStyles from './containers/Modal/AlgorithmInfo.style'

import medicalCaseIndexStyles from './containers/MedicalCase/Index.style'
import medicalCaseListStyles from './containers/MedicalCase/List.style'

import scanIndexStyles from './containers/Scan/Index.style'
import filtersIndexStyles from './containers/Filters/Index.style'
import patientListStyles from './containers/Patient/List.style'
import settingsIndexStyles from './containers/Settings/Index.style'
import searchIndexStyles from './containers/Search/Index.style'
import homeIndexStyles from './containers/Home/Index.style'
import synchronizationIndexStyles from './containers/Synchronization/Index.style'

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
    modalIndex: modalIndexStyles(props),
    modalAlgorithm: modalAlgorithmStyles(props),
    settings: settingsIndexStyles(props),
    search: searchIndexStyles(props),
    home: homeIndexStyles(props),
    medicalCase: medicalCaseIndexStyles(props),
    scan: scanIndexStyles(props),
    patientList: patientListStyles(props),
    filters: filtersIndexStyles(props),
    medicalCaseList: medicalCaseListStyles(props),
    synchronization: synchronizationIndexStyles(props),
  }
}
