import { connect } from 'react-redux';
import PatientUpsert from './PatientUpsert.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setMedicalCase, updatePatient, updateMedicalCaseProperty } from '../../../../frontend_service/actions/creators.actions';
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WrapperNavigation(PatientUpsert))));
