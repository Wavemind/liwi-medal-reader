import { connect } from 'react-redux';
import Diagnoses from './Diagnoses.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setMedicalCase, updatePatient } from '../../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(Diagnoses)));
