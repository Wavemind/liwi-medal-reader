import { connect } from 'react-redux';
import TabsNavigation from './PatientProfileMenu.navigation';
import { withSessions } from '../../contexts/Sessions.context';
import { withApplication } from '../../contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(
  mapStateToProps,

  mapDispatchToProps
)(withSessions(withApplication(PatientSummaryMenu)));
