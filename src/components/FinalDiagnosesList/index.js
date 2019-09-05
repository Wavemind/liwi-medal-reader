import { withSessions } from 'engine/contexts/Sessions.context';
import { connect } from 'react-redux';
import FinalDiagnosesList from './FinalDiagnosesList';
import { withApplication } from '../../engine/contexts/Application.context';

const mapStateToProps = (state) => {
  return {
    medicalCase: state,
  };
};

export default connect(mapStateToProps)(
  withSessions(withApplication(FinalDiagnosesList))
);
