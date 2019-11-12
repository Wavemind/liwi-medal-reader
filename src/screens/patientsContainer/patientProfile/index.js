import { connect } from 'react-redux';
import patientProfile from './PatientProfile.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { setMedicalCase, updatePatient } from '../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
  };
};


const defaultProps = {
  navigationStatus: 'willBlur',
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(WrapperNavigation(patientProfile, defaultProps))));
