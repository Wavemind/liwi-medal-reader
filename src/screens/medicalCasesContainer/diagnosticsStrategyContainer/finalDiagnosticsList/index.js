import { connect } from 'react-redux';
import FinalDiagnosticsList from './FinalDiagnosticsList';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { setDiagnoses } from '../../../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDiagnoses: (algorithm, type, diagnoses, actionDiagnoses) => dispatch(setDiagnoses(algorithm, type, diagnoses, actionDiagnoses)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplication(WrapperNavigation(FinalDiagnosticsList)));
