import { connect } from 'react-redux';
import PatientUpsert from './PatientUpsert.screen';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setMedicalCase, updateMedicalCaseProperty, updateMetaData, updateModalFromRedux, updatePatient, addConsent } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
    updatePatient: (index, value) => dispatch(updatePatient(index, value)),
    updateMedicalCaseProperty: (property, newValue) => dispatch(updateMedicalCaseProperty(property, newValue)),
    updateMetaData: (screen, view, value) => dispatch(updateMetaData(screen, view, value)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
    addConsent: (page) => dispatch(addConsent(page)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(PatientUpsert)));
