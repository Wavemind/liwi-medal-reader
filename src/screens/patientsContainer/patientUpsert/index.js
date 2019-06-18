import PatientUpsert from './PatientUpsert.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { upsertPatient } from '../../../../frontend_service/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    newPatient: (key, value) => dispatch(upsertPatient(key, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(PatientUpsert)));
