import PatientNew from './PatientNew.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { newPatient } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    newPatient: (key, value) => dispatch(newPatient(key, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(PatientNew)));
