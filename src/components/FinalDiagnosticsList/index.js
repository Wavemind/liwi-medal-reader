import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';
import FinalDiagnosticsList from './FinalDiagnosticsList';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (state) => {
  return {
    medicalCase: state,
  };
};

export default connect(mapStateToProps)(
  withSessions(withApplication(FinalDiagnosticsList))
);
