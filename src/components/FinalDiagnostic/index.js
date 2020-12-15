import { connect } from 'react-redux';
import FinalDiagnostic from './FinalDiagnostic';
import { withApplication } from '../../engine/contexts/Application.context';
import { setDiagnoses, updateModalFromRedux } from '../../../frontend_service/actions/creators.actions';

const mapStateToProps = (state) => {
  return {
    medicalCase: state,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    setDiagnoses: (algorithm, type, diagnoses, actionDiagnoses) => dispatch(setDiagnoses(algorithm, type, diagnoses, actionDiagnoses)),
    updateModalFromRedux: (params, type) => dispatch(updateModalFromRedux(params, type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(FinalDiagnostic));
