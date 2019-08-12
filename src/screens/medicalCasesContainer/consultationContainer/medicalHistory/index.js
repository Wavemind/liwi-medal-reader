import { connect } from 'react-redux';
import MedicalHistory from './MedicalHistory.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';

const mapStateToProps = (medicalCase) => {
  return { medicalCase };
};

export default connect(mapStateToProps)(
  withSessions(withApplication(MedicalHistory))
);
