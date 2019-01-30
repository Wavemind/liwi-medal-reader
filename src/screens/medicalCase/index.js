import medicalCase from './MedicalCase.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { setMedicalCase } from '../../engine/actions/creators.actions';

const mapStateToProps = (medicalCase, ownProps) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePatient: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(medicalCase)));
