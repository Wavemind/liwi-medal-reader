import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';
import FinalDiagnosticsList from './FinalDiagnosticsList';
import { withApplication } from '../../engine/contexts/Application.context';
import { setDiagnoses } from '../../../frontend_service/actions/creators.actions';
import { WrapperNavigation } from '../../utils/WrapperNavigation';

const mapStateToProps = (medicalCase) => {
  return {
    medicalCase,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDiagnoses: (type, diagnoses, actionDiagnoses) => dispatch(setDiagnoses(type, diagnoses, actionDiagnoses)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withSessions(withApplication(WrapperNavigation(FinalDiagnosticsList))));
