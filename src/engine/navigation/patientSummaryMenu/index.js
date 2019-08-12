import { connect } from 'react-redux';
import PatientSummaryMenu from './PatientSummaryMenu.navigation';
import { withSessions } from '../../contexts/Sessions.context';
import { withApplication } from '../../contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(
  withSessions(withApplication(PatientSummaryMenu))
);
