import medicalCases from './MedicalCases.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';
import { connect } from 'react-redux';
import { setMedicalCase } from '../../engine/actions/creators.actions';
import { actions } from '../../engine/actions/types.actions';

const mapStateToProps = (state, ownProps) => {
  return {
    state,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setMedicalCase: (medicalCase) => dispatch(setMedicalCase(medicalCase)),
    clear: () => dispatch({ type: actions.MEDICAL_CASE_CLEAR }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSessions(withApplication(medicalCases)));
