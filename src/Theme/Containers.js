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

import studyIndexStyles from './containers/Study/Index.style'
import emergencyIndexStyles from './containers/Emergency/Index.style'
import questionInfoIndexStyles from './containers/QuestionInfo/Index.style'

import medicalCaseIndexStyles from './containers/MedicalCase/Index.style'
import medicalCaseListStyles from './containers/MedicalCase/List.style'
import medicalCaseDiagnosesIndexStyles from './containers/MedicalCase/Diagnoses/DiagnosesIndex.style'

import patientListStyles from './containers/Patient/List.style'
import patientPersonalInfoStyles from './containers/Patient/PersonalInfo.style'

import diagnosisListStyles from './containers/Diagnosis/List.style'

import consentListStyles from './containers/Consent/List.style'
import consentPreviewStyles from './containers/Consent/Preview.style'
import consentCameraStyles from './containers/Consent/Camera.style'

import scanIndexStyles from './containers/Scan/Index.style'
import filtersIndexStyles from './containers/Filters/Index.style'
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
    settings: settingsIndexStyles(props),
    search: searchIndexStyles(props),
    home: homeIndexStyles(props),
    medicalCase: medicalCaseIndexStyles(props),
    medicalCaseDiagnoses: medicalCaseDiagnosesIndexStyles(props),
    scan: scanIndexStyles(props),
    patientList: patientListStyles(props),
    patientPersonalInfo: patientPersonalInfoStyles(props),
    consentList: consentListStyles(props),
    filters: filtersIndexStyles(props),
    medicalCaseList: medicalCaseListStyles(props),
    synchronization: synchronizationIndexStyles(props),
    consentPreview: consentPreviewStyles(props),
    consentCamera: consentCameraStyles(props),
    study: studyIndexStyles(props),
    emergency: emergencyIndexStyles(props),
    questionInfo: questionInfoIndexStyles(props),
    diagnosisList: diagnosisListStyles(props),
  }
}
