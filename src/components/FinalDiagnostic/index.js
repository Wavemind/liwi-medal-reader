import { connect } from 'react-redux';
import FinalDiagnostic from './FinalDiagnostic';
import { withApplication } from '../../engine/contexts/Application.context';
import { setDiagnoses } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (state) => {
  return {
    medicalCase: state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setDiagnoses: (type, diagnoses, actionDiagnoses) => dispatch(setDiagnoses(type, diagnoses, actionDiagnoses)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withApplication(FinalDiagnostic));
