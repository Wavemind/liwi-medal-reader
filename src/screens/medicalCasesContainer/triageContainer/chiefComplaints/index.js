import { connect } from 'react-redux';
import ChiefComplaint from './ChiefComplaints.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(
  mapStateToProps
)(withSessions(withApplication(ChiefComplaint)));
