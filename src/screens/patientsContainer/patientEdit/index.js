import PatientEdit from './PatientEdit.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { updatePatient } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePatient: (key, value) => dispatch(updatePatient(key, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(PatientEdit)));
